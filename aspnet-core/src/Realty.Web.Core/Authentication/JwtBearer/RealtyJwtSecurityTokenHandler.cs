using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abp;
using Abp.UI;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Runtime.Caching;
using Abp.Threading;
using Abp.Runtime.Security;
using Microsoft.IdentityModel.Tokens;
using Realty.Authorization.Users;
using Realty.Authorization.Delegation;
using Realty.Authorization;

namespace Realty.Web.Authentication.JwtBearer
{
    public class RealtyJwtSecurityTokenHandler : ISecurityTokenValidator
    {
        private readonly JwtSecurityTokenHandler _tokenHandler;

        public RealtyJwtSecurityTokenHandler()
        {
            _tokenHandler = new JwtSecurityTokenHandler();
        }

        public bool CanValidateToken => true;

        public int MaximumTokenSizeInBytes { get; set; } = TokenValidationParameters.DefaultMaximumTokenSizeInBytes;

        public bool CanReadToken(string securityToken)
        {
            return _tokenHandler.CanReadToken(securityToken);
        }

        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters, out SecurityToken validatedToken)
        {
            var cacheManager = IocManager.Instance.Resolve<ICacheManager>();
            var principal = _tokenHandler.ValidateToken(securityToken, validationParameters, out validatedToken);

            if (!HasAccessTokenType(principal))
            {
                throw new SecurityTokenException("invalid token type");
            }

            AsyncHelper.RunSync(() => ValidateSecurityStampAsync(principal));

            var tokenValidityKeyClaim = principal.Claims.First(c => c.Type == AppConsts.TokenValidityKey);
            if (TokenValidityKeyExistsInCache(tokenValidityKeyClaim, cacheManager))
            {
                return principal;
            }

            var userIdentifierString = principal.Claims.First(c => c.Type == AppConsts.UserIdentifier);
            var userIdentifier = UserIdentifier.Parse(userIdentifierString.Value);

            if (!ValidateTokenValidityKey(tokenValidityKeyClaim, userIdentifier))
            {
                throw new SecurityTokenException("invalid");
            }

            var tokenAuthConfiguration = IocManager.Instance.Resolve<TokenAuthConfiguration>();
            cacheManager
                .GetCache(AppConsts.TokenValidityKey)
                .Set(tokenValidityKeyClaim.Value, "", absoluteExpireTime: tokenAuthConfiguration.AccessTokenExpiration);

            return principal;
        }

        private bool ValidateTokenValidityKey(Claim tokenValidityKeyClaim, UserIdentifier userIdentifier)
        {
            bool isValid;

            using (var unitOfWorkManager = IocManager.Instance.ResolveAsDisposable<IUnitOfWorkManager>())
            {
                using (var uow = unitOfWorkManager.Object.Begin())
                {
                    using (unitOfWorkManager.Object.Current.SetTenantId(userIdentifier.TenantId))
                    {
                        using (var userManager = IocManager.Instance.ResolveAsDisposable<UserManager>())
                        {
                            var userManagerObject = userManager.Object;
                            var user = userManagerObject.GetUser(userIdentifier);
                            isValid = AsyncHelper.RunSync(() => userManagerObject.IsTokenValidityKeyValidAsync(user, tokenValidityKeyClaim.Value));

                            uow.Complete();
                        }
                    }
                }
            }

            return isValid;
        }

        private static bool TokenValidityKeyExistsInCache(Claim tokenValidityKeyClaim, ICacheManager cacheManager)
        {
            var tokenValidityKeyInCache = cacheManager
                .GetCache(AppConsts.TokenValidityKey)
                .GetOrDefault(tokenValidityKeyClaim.Value);

            return tokenValidityKeyInCache != null;
        }

        private static async Task ValidateSecurityStampAsync(ClaimsPrincipal principal)
        {
            ValidateUserDelegation(principal);

            using (var securityStampHandler = IocManager.Instance.ResolveAsDisposable<IJwtSecurityStampHandler>())
            {
                if (!await securityStampHandler.Object.Validate(principal))
                {
                    throw new SecurityTokenException("invalid");
                }
            }
        }

        private bool HasAccessTokenType(ClaimsPrincipal principal)
        {
            return principal.Claims.FirstOrDefault(x => x.Type == AppConsts.TokenType)?.Value ==
                   TokenType.AccessToken.To<int>().ToString();
        }

        private static void ValidateUserDelegation(ClaimsPrincipal principal)
        {
            var _userDelegationConfiguration = IocManager.Instance.Resolve<IUserDelegationConfiguration>();
            if (!_userDelegationConfiguration.IsEnabled)
            {
                return;
            }

            var impersonatorTenant = principal.Claims.FirstOrDefault(c => c.Type == AbpClaimTypes.ImpersonatorTenantId);
            var user = principal.Claims.FirstOrDefault(c => c.Type == AbpClaimTypes.UserId);
            var impersonatorUser = principal.Claims.FirstOrDefault(c => c.Type == AbpClaimTypes.ImpersonatorUserId);

            if (impersonatorUser == null || user == null)
            {
                return;
            }

            var impersonatorTenantId = impersonatorTenant == null ? null : impersonatorTenant.Value.IsNullOrEmpty() ? (int?)null : Convert.ToInt32(impersonatorTenant.Value);
            var sourceUserId = Convert.ToInt64(user.Value);
            var impersonatorUserId = Convert.ToInt64(impersonatorUser.Value);

            using (var _permissionChecker = IocManager.Instance.ResolveAsDisposable<PermissionChecker>())
            {
                if (_permissionChecker.Object.IsGranted(new UserIdentifier(impersonatorTenantId, impersonatorUserId), AppPermissions.Pages_Administration_Users_Impersonation))
                {
                    return;
                }
            }

            using (var userDelegationManager = IocManager.Instance.ResolveAsDisposable<IUserDelegationManager>())
            {
                var hasActiveDelegation = userDelegationManager.Object.HasActiveDelegation(sourceUserId, impersonatorUserId);

                if (!hasActiveDelegation)
                {
                    throw new UserFriendlyException("ThereIsNoActiveUserDelegationBetweenYourUserAndCurrentUser");
                }
            }
        }
    }
}
