using System.Collections.Generic;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.AspNetZeroCore.Web.Authentication.External.Microsoft;
using Abp.AspNetZeroCore.Web.Authentication.External.OpenIdConnect;
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
    public class TenantBasedOpenIdConnectExternalLoginInfoProvider : TenantBasedExternalLoginInfoProviderBase, ISingletonDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IAbpSession _abpSession;
        public override string Name { get; } = OpenIdConnectAuthProviderApi.Name;

        public TenantBasedOpenIdConnectExternalLoginInfoProvider(
            ISettingManager settingManager,
            IAbpSession abpSession,
            ICacheManager cacheManager) : base(abpSession, cacheManager)
        {
            _settingManager = settingManager;
            _abpSession = abpSession;
        }

        private ExternalLoginProviderInfo CreateExternalLoginInfo(OpenIdConnectExternalLoginProviderSettings settings)
        {
            var mappingSettings = _settingManager.GetSettingValue(AppSettings.ExternalLoginProvider.OpenIdConnectMappedClaims);
            var jsonClaimMappings = mappingSettings.FromJsonString<List<JsonClaimMap>>();

            return new ExternalLoginProviderInfo(
                OpenIdConnectAuthProviderApi.Name,
                settings.ClientId,
                settings.ClientSecret,
                typeof(OpenIdConnectAuthProviderApi),
                new Dictionary<string, string>
                {
                    {"Authority", settings.Authority},
                    {"LoginUrl", settings.LoginUrl},
                    {"ValidateIssuer", settings.ValidateIssuer.ToString()}
                },
                jsonClaimMappings
            );
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect, _abpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override ExternalLoginProviderInfo GetTenantInformation()
        {
            string settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect, _abpSession.TenantId.Value);
            var settings = settingValue.FromJsonString<OpenIdConnectExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }

        protected override ExternalLoginProviderInfo GetHostInformation()
        {
            string settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.OpenIdConnect);
            var settings = settingValue.FromJsonString<OpenIdConnectExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }
    }
}