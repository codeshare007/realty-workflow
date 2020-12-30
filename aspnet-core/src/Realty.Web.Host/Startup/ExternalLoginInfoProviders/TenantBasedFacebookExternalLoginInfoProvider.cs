using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.AspNetZeroCore.Web.Authentication.External.Facebook;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using Realty.Authentication;
using Realty.Configuration;

namespace Realty.Web.Startup.ExternalLoginInfoProviders
{
    public class TenantBasedFacebookExternalLoginInfoProvider : TenantBasedExternalLoginInfoProviderBase, ISingletonDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IAbpSession _abpSession;
        public override string Name { get; } = FacebookAuthProviderApi.Name;

        public TenantBasedFacebookExternalLoginInfoProvider(
            ISettingManager settingManager,
            IAbpSession abpSession,
            ICacheManager cacheManager):base(abpSession, cacheManager)
        {
            _settingManager = settingManager;
            _abpSession = abpSession;
        }

        private ExternalLoginProviderInfo CreateExternalLoginInfo(FacebookExternalLoginProviderSettings settings)
        {
            return new ExternalLoginProviderInfo(Name, settings.AppId, settings.AppSecret, typeof(FacebookAuthProviderApi));
        }
        
        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Facebook, _abpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override ExternalLoginProviderInfo GetTenantInformation()
        {
            string settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Facebook, _abpSession.TenantId.Value);
            var settings = settingValue.FromJsonString<FacebookExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }

        protected override ExternalLoginProviderInfo GetHostInformation()
        {
            string settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Facebook);
            var settings = settingValue.FromJsonString<FacebookExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }
    }
}