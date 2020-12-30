using Abp.AspNetZeroCore.Web.Authentication.External.Facebook;
using Abp.Dependency;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using Realty.Configuration;

namespace Realty.Web.Startup.ExternalLoginInfoProviders
{
    public class ExternalLoginOptionsCacheManager : IExternalLoginOptionsCacheManager, ITransientDependency
    {
        private readonly ICacheManager _cacheManager;
        private readonly IAbpSession _abpSession;

        public ExternalLoginOptionsCacheManager(ICacheManager cacheManager, IAbpSession abpSession)
        {
            _cacheManager = cacheManager;
            _abpSession = abpSession;
        }

        public void ClearCache()
        {
            ClearFacebookCache();
        }

        private void ClearFacebookCache()
        {
            _cacheManager.GetExternalLoginInfoProviderCache().Remove(GetCacheKey(FacebookAuthProviderApi.Name));
        }

        private string GetCacheKey(string name)
        {
            if (_abpSession.TenantId.HasValue)
            {
                return $"{name}-{_abpSession.TenantId.Value}";
            }

            return $"{name}";
        }
    }
}