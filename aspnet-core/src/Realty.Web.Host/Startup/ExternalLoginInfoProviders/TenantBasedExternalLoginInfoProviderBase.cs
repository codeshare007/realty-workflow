using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
namespace Realty.Web.Startup.ExternalLoginInfoProviders
{
    public abstract class TenantBasedExternalLoginInfoProviderBase: IExternalLoginInfoProvider
    {
        private readonly IAbpSession _abpSession;
        private readonly ICacheManager _cacheManager;
        public abstract string Name { get; }
        
        protected TenantBasedExternalLoginInfoProviderBase(
            IAbpSession abpSession,
            ICacheManager cacheManager)
        {
            _abpSession = abpSession;
            _cacheManager = cacheManager;
        }
        
        protected abstract bool TenantHasSettings();
        
        protected abstract ExternalLoginProviderInfo GetTenantInformation();
        
        protected abstract ExternalLoginProviderInfo GetHostInformation();
        
        public virtual ExternalLoginProviderInfo GetExternalLoginInfo()
        {
            if (_abpSession.TenantId.HasValue && TenantHasSettings())
            {
                return _cacheManager.GetExternalLoginInfoProviderCache()
                    .Get(GetCacheKey(), GetTenantInformation);
            }
            
            return _cacheManager.GetExternalLoginInfoProviderCache()
                    .Get(GetCacheKey(), GetHostInformation);
        }
        
        private string GetCacheKey()
        {
            if (_abpSession.TenantId.HasValue)
            {
                return $"{Name}-{_abpSession.TenantId.Value}";
            }

            return $"{Name}";
        }
    }
}