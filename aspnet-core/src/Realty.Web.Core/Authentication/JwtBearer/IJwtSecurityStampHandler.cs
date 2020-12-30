using System.Security.Claims;
using System.Threading.Tasks;

namespace Realty.Web.Authentication.JwtBearer
{
    public interface IJwtSecurityStampHandler
    {
        /// <summary>
        /// Returns true when claimsPrincipal contains a valid security stamp
        /// </summary>
        /// <param name="claimsPrincipal"></param>
        /// <returns></returns>
        Task<bool> Validate(ClaimsPrincipal claimsPrincipal);

        /// <summary>
        /// Sets a cache item for given user with the given  securityStamp value
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="userId"></param>
        /// <param name="securityStamp"></param>
        /// <returns></returns>
        Task SetSecurityStampCacheItem(int? tenantId, long userId, string securityStamp);

        /// <summary>
        /// Removes the security stamp item from cache for the given user
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task RemoveSecurityStampCacheItem(int? tenantId, long userId);
    }
}
