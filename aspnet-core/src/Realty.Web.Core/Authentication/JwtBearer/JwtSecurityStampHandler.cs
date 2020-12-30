using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abp;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Runtime.Caching;
using Realty.Authorization.Users;
using Realty.Identity;

namespace Realty.Web.Authentication.JwtBearer
{
    public class JwtSecurityStampHandler : IJwtSecurityStampHandler, ITransientDependency
    {
        private readonly ICacheManager _cacheManager;
        private readonly SignInManager _signInManager;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly UserManager _userManager;

        public JwtSecurityStampHandler(
            ICacheManager cacheManager,
            SignInManager signInManager,
            IUnitOfWorkManager unitOfWorkManager,
            UserManager userManager)
        {
            _cacheManager = cacheManager;
            _signInManager = signInManager;
            _unitOfWorkManager = unitOfWorkManager;
            _userManager = userManager;
        }

        public async Task<bool> Validate(ClaimsPrincipal claimsPrincipal)
        {
            if (claimsPrincipal?.Claims == null || !claimsPrincipal.Claims.Any())
            {
                return false;
            }

            var securityStampKey = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == AppConsts.SecurityStampKey);
            if (securityStampKey == null)
            {
                return false;
            }

            var userIdentifierString = claimsPrincipal.Claims.First(c => c.Type == AppConsts.UserIdentifier);
            var userIdentifier = UserIdentifier.Parse(userIdentifierString.Value);

            var isValid = await ValidateSecurityStampFromCache(userIdentifier, securityStampKey.Value);
            if (!isValid)
            {
                isValid = await ValidateSecurityStampFromDb(userIdentifier, securityStampKey.Value);
            }

            return isValid;
        }

        public async Task SetSecurityStampCacheItem(int? tenantId, long userId, string securityStamp)
        {
            await _cacheManager.GetCache(AppConsts.SecurityStampKey)
                .SetAsync(GenerateCacheKey(tenantId, userId), securityStamp);
        }

        public async Task RemoveSecurityStampCacheItem(int? tenantId, long userId)
        {
            await _cacheManager.GetCache(AppConsts.SecurityStampKey).RemoveAsync(GenerateCacheKey(tenantId, userId));
        }

        private string GenerateCacheKey(int? tenantId, long userId) => $"{tenantId}.{userId}";

        private async Task<bool> ValidateSecurityStampFromCache(UserIdentifier userIdentifier, string securityStamp)
        {
            var securityStampKey = await _cacheManager
                .GetCache(AppConsts.SecurityStampKey)
                .GetOrDefaultAsync(GenerateCacheKey(userIdentifier.TenantId, userIdentifier.UserId));

            return securityStampKey != null && (string)securityStampKey == securityStamp;
        }

        private async Task<bool> ValidateSecurityStampFromDb(UserIdentifier userIdentifier, string securityStamp)
        {
            using (var uow = _unitOfWorkManager.Begin())
            {
                using (_unitOfWorkManager.Current.SetTenantId(userIdentifier.TenantId))
                {
                    var user = _userManager.GetUser(userIdentifier);
                    uow.Complete();

                    //cache last requested value
                    await SetSecurityStampCacheItem(userIdentifier.TenantId, userIdentifier.UserId, user.SecurityStamp);

                    return await _signInManager.ValidateSecurityStampAsync(user, securityStamp);
                }
            }
        }
    }
}
