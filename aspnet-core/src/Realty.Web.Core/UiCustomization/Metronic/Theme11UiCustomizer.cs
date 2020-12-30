using System.Threading.Tasks;
using Abp;
using Abp.Configuration;
using Realty.Configuration;
using Realty.Configuration.Dto;
using Realty.UiCustomization;
using Realty.UiCustomization.Dto;

namespace Realty.Web.UiCustomization.Metronic
{
    public class Theme11UiCustomizer : UiThemeCustomizerBase, IUiCustomizer
    {
        public Theme11UiCustomizer(ISettingManager settingManager)
            : base(settingManager, AppConsts.Theme11)
        {
        }

        public async Task<UiCustomizationSettingsDto> GetUiSettings()
        {
            var settings = new UiCustomizationSettingsDto
            {
                BaseSettings = new ThemeSettingsDto
                {
                    Layout = new ThemeLayoutSettingsDto
                    {
                        LayoutType = await GetSettingValueAsync(AppSettings.UiManagement.LayoutType)
                    },
                    Header = new ThemeHeaderSettingsDto
                    {
                        MobileFixedHeader = await GetSettingValueAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader)
                    },
                    Menu = new ThemeMenuSettingsDto
                    {
                        FixedAside = await GetSettingValueAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside),
                        SearchActive = await GetSettingValueAsync<bool>(AppSettings.UiManagement.SearchActive)
                    }
                }
            };

            settings.BaseSettings.Theme = ThemeName;
            settings.BaseSettings.Header.DesktopFixedHeader = true;
            settings.BaseSettings.SubHeader.SubheaderStyle = "transparent";
            settings.BaseSettings.Menu.Position = "left";
            settings.BaseSettings.Menu.AsideSkin = "light";
            settings.BaseSettings.Menu.SubmenuToggle = "false";

            settings.BaseSettings.SubHeader.SubheaderSize = 5;
            settings.BaseSettings.SubHeader.TitleStlye = "text-dark font-weight-bold my-2 mr-5";
            settings.BaseSettings.SubHeader.ContainerStyle = "subheader py-2 py-lg-4  subheader-transparent";
            
            settings.IsLeftMenuUsed = true;
            settings.IsTopMenuUsed = false;
            settings.IsTabMenuUsed = false;

            return settings;
        }

        public async Task UpdateUserUiManagementSettingsAsync(UserIdentifier user, ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForUserAsync(user, AppSettings.UiManagement.Theme, ThemeName);

            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LayoutType, settings.Layout.LayoutType);
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
        }

        public async Task UpdateTenantUiManagementSettingsAsync(int tenantId, ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Theme, ThemeName);

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LayoutType, settings.Layout.LayoutType);
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
        }

        public async Task UpdateApplicationUiManagementSettingsAsync(ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.UiManagement.Theme, ThemeName);

            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LayoutType, settings.Layout.LayoutType);
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());
        }

        public async Task<ThemeSettingsDto> GetHostUiManagementSettings()
        {
            var theme = await SettingManager.GetSettingValueForApplicationAsync(AppSettings.UiManagement.Theme);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Layout = new ThemeLayoutSettingsDto
                {
                    LayoutType = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.LayoutType)
                },
                Header = new ThemeHeaderSettingsDto
                {
                    MobileFixedHeader = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader),
                },
                Menu = new ThemeMenuSettingsDto
                {
                    FixedAside = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside),
                    SearchActive = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.SearchActive)
                }
            };
        }

        public async Task<ThemeSettingsDto> GetTenantUiCustomizationSettings(int tenantId)
        {
            var theme = await SettingManager.GetSettingValueForTenantAsync(AppSettings.UiManagement.Theme, tenantId);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Layout = new ThemeLayoutSettingsDto
                {
                    LayoutType = await GetSettingValueForTenantAsync(AppSettings.UiManagement.LayoutType, tenantId)
                },
                Header = new ThemeHeaderSettingsDto
                {
                    MobileFixedHeader = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader, tenantId),
                },
                Menu = new ThemeMenuSettingsDto
                {
                    FixedAside = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside, tenantId),
                    SearchActive = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.SearchActive, tenantId)
                }
            };
        }
    }
}
