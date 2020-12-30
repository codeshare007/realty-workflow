using System.Collections.Generic;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.AspNetZeroCore.Web.Authentication.External.Microsoft;
using Abp.AspNetZeroCore.Web.Authentication.External.WsFederation;
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
    public class TenantBasedWsFederationExternalLoginInfoProvider : TenantBasedExternalLoginInfoProviderBase,
        ISingletonDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IAbpSession _abpSession;
        public override string Name { get; } = WsFederationAuthProviderApi.Name;

        public TenantBasedWsFederationExternalLoginInfoProvider(
            ISettingManager settingManager,
            IAbpSession abpSession,
            ICacheManager cacheManager) : base(abpSession, cacheManager)
        {
            _settingManager = settingManager;
            _abpSession = abpSession;
        }

        private ExternalLoginProviderInfo CreateExternalLoginInfo(WsFederationExternalLoginProviderSettings settings)
        {
            var mappingSettings = _settingManager.GetSettingValue(AppSettings.ExternalLoginProvider.WsFederationMappedClaims);
            var jsonClaimMappings = mappingSettings.FromJsonString<List<JsonClaimMap>>();

            return new ExternalLoginProviderInfo(
                WsFederationAuthProviderApi.Name,
                settings.ClientId,
                "",
                typeof(WsFederationAuthProviderApi),
                new Dictionary<string, string>
                {
                    {"Tenant", settings.Tenant},
                    {"MetaDataAddress", settings.MetaDataAddress},
                    {"Authority", settings.Authority}
                },
                jsonClaimMappings
            );
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.WsFederation, _abpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override ExternalLoginProviderInfo GetTenantInformation()
        {
            string settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.WsFederation, _abpSession.TenantId.Value);
            var settings = settingValue.FromJsonString<WsFederationExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }

        protected override ExternalLoginProviderInfo GetHostInformation()
        {
            string settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.WsFederation);
            var settings = settingValue.FromJsonString<WsFederationExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }
    }
}