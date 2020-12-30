using System.Threading.Tasks;
using Abp;
using Abp.Configuration;
using Realty.Configuration;
using Realty.Configuration.Dto;
using Realty.UiCustomization;
using Realty.UiCustomization.Dto;

namespace Realty.Web.UiCustomization.Metronic
{
    public class ThemeDefaultUiCustomizer : UiThemeCustomizerBase, IUiCustomizer
    {
        public ThemeDefaultUiCustomizer(ISettingManager settingManager)
            : base(settingManager, AppConsts.ThemeDefault)
        {
        }

        public async Task<UiCustomizationSettingsDto> GetUiSettings()
        {
            var settings = new UiCustomizationSettingsDto
            {
                BaseSettings = new ThemeSettingsDto
                {
                    Header = new ThemeHeaderSettingsDto
                    {
                        DesktopFixedHeader = await GetSettingValueAsync<bool>(AppSettings.UiManagement.Header.DesktopFixedHeader),
                        MobileFixedHeader = await GetSettingValueAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader),
                        HeaderSkin = await GetSettingValueAsync(AppSettings.UiManagement.Header.Skin)
                    },
                    SubHeader = new ThemeSubHeaderSettingsDto
                    {
                        FixedSubHeader = await GetSettingValueAsync<bool>(AppSettings.UiManagement.SubHeader.Fixed),
                        SubheaderStyle = await GetSettingValueAsync(AppSettings.UiManagement.SubHeader.Style)
                    },
                    Menu = new ThemeMenuSettingsDto
                    {
                        AsideSkin = await GetSettingValueAsync(AppSettings.UiManagement.LeftAside.AsideSkin),
                        FixedAside = await GetSettingValueAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside),
                        AllowAsideMinimizing = await GetSettingValueAsync<bool>(AppSettings.UiManagement.LeftAside.AllowAsideMinimizing),
                        DefaultMinimizedAside = await GetSettingValueAsync<bool>(AppSettings.UiManagement.LeftAside.DefaultMinimizedAside),
                        SubmenuToggle = await GetSettingValueAsync(AppSettings.UiManagement.LeftAside.SubmenuToggle),
                        HoverableAside = await GetSettingValueAsync<bool>(AppSettings.UiManagement.LeftAside.HoverableAside),
                        SearchActive = await GetSettingValueAsync<bool>(AppSettings.UiManagement.SearchActive),
                    },
                    Footer = new ThemeFooterSettingsDto
                    {
                        FixedFooter = await GetSettingValueAsync<bool>(AppSettings.UiManagement.Footer.FixedFooter)
                    }
                }
            };

            settings.BaseSettings.Theme = ThemeName;
            settings.BaseSettings.Layout.LayoutType = "fluid";
            settings.BaseSettings.Menu.Position = "left";
            settings.BaseSettings.SubHeader.SubheaderSize = 5;
            settings.BaseSettings.SubHeader.TitleStlye = "text-dark font-weight-bold mt-2 mb-2 mr-5";
            settings.BaseSettings.SubHeader.ContainerStyle = "subheader py-2 py-lg-4 subheader-solid";
            
            settings.IsLeftMenuUsed = true;
            settings.IsTopMenuUsed = false;
            settings.IsTabMenuUsed = false;

            return settings;
        }

        public async Task UpdateUserUiManagementSettingsAsync(UserIdentifier user, ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForUserAsync(user, AppSettings.UiManagement.Theme, ThemeName);

            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Header.Skin, settings.Header.HeaderSkin);

            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.SubHeader.Fixed, settings.SubHeader.FixedSubHeader.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.SubHeader.Style, settings.SubHeader.SubheaderStyle);

            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.AsideSkin, settings.Menu.AsideSkin);
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.AllowAsideMinimizing, settings.Menu.AllowAsideMinimizing.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.DefaultMinimizedAside, settings.Menu.DefaultMinimizedAside.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.SubmenuToggle, settings.Menu.SubmenuToggle);
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.LeftAside.HoverableAside, settings.Menu.HoverableAside.ToString());
            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());

            await ChangeSettingForUserAsync(user, AppSettings.UiManagement.Footer.FixedFooter, settings.Footer.FixedFooter.ToString());
        }

        public async Task UpdateTenantUiManagementSettingsAsync(int tenantId, ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Theme, settings.Theme);

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Header.Skin, settings.Header.HeaderSkin);

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.SubHeader.Fixed, settings.SubHeader.FixedSubHeader.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.SubHeader.Style, settings.SubHeader.SubheaderStyle);

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.AsideSkin, settings.Menu.AsideSkin);
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.AllowAsideMinimizing, settings.Menu.AllowAsideMinimizing.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.DefaultMinimizedAside, settings.Menu.DefaultMinimizedAside.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.SubmenuToggle, settings.Menu.SubmenuToggle);
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.LeftAside.HoverableAside, settings.Menu.HoverableAside.ToString());
            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());

            await ChangeSettingForTenantAsync(tenantId, AppSettings.UiManagement.Footer.FixedFooter, settings.Footer.FixedFooter.ToString());
        }

        public async Task UpdateApplicationUiManagementSettingsAsync(ThemeSettingsDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.UiManagement.Theme, settings.Theme);

            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.DesktopFixedHeader, settings.Header.DesktopFixedHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.MobileFixedHeader, settings.Header.MobileFixedHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Header.Skin, settings.Header.HeaderSkin);

            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.SubHeader.Fixed, settings.SubHeader.FixedSubHeader.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.SubHeader.Style, settings.SubHeader.SubheaderStyle);

            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.AsideSkin, settings.Menu.AsideSkin);
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.FixedAside, settings.Menu.FixedAside.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.AllowAsideMinimizing, settings.Menu.AllowAsideMinimizing.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.DefaultMinimizedAside, settings.Menu.DefaultMinimizedAside.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.SubmenuToggle, settings.Menu.SubmenuToggle);
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.LeftAside.HoverableAside, settings.Menu.HoverableAside.ToString());
            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.SearchActive, settings.Menu.SearchActive.ToString());

            await ChangeSettingForApplicationAsync(AppSettings.UiManagement.Footer.FixedFooter, settings.Footer.FixedFooter.ToString());
        }

        public async Task<ThemeSettingsDto> GetHostUiManagementSettings()
        {
            var theme = await SettingManager.GetSettingValueForApplicationAsync(AppSettings.UiManagement.Theme);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Header = new ThemeHeaderSettingsDto
                {
                    DesktopFixedHeader = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.Header.DesktopFixedHeader),
                    MobileFixedHeader = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader),
                    HeaderSkin = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.Header.Skin)
                },
                SubHeader = new ThemeSubHeaderSettingsDto
                {
                    FixedSubHeader = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.SubHeader.Fixed),
                    SubheaderStyle = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.SubHeader.Style)
                },
                Menu = new ThemeMenuSettingsDto
                {
                    AsideSkin = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.LeftAside.AsideSkin),
                    FixedAside = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside),
                    AllowAsideMinimizing = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.LeftAside.AllowAsideMinimizing),
                    DefaultMinimizedAside = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.LeftAside.DefaultMinimizedAside),
                    SubmenuToggle = await GetSettingValueForApplicationAsync(AppSettings.UiManagement.LeftAside.SubmenuToggle),
                    HoverableAside = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.LeftAside.HoverableAside),
                    SearchActive = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.SearchActive),
                },
                Footer = new ThemeFooterSettingsDto
                {
                    FixedFooter = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.Footer.FixedFooter)
                }
            };
        }

        public async Task<ThemeSettingsDto> GetTenantUiCustomizationSettings(int tenantId)
        {
            var theme = await SettingManager.GetSettingValueForTenantAsync(AppSettings.UiManagement.Theme, tenantId);

            return new ThemeSettingsDto
            {
                Theme = theme,
                Header = new ThemeHeaderSettingsDto
                {
                    DesktopFixedHeader = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.Header.DesktopFixedHeader, tenantId),
                    MobileFixedHeader = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.Header.MobileFixedHeader, tenantId),
                    HeaderSkin = await GetSettingValueForTenantAsync(AppSettings.UiManagement.Header.Skin, tenantId)
                },
                SubHeader = new ThemeSubHeaderSettingsDto
                {
                    FixedSubHeader = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.SubHeader.Fixed, tenantId),
                    SubheaderStyle = await GetSettingValueForTenantAsync(AppSettings.UiManagement.SubHeader.Style, tenantId)
                },
                Menu = new ThemeMenuSettingsDto
                {
                    AsideSkin = await GetSettingValueForTenantAsync(AppSettings.UiManagement.LeftAside.AsideSkin, tenantId),
                    FixedAside = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.LeftAside.FixedAside, tenantId),
                    AllowAsideMinimizing = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.LeftAside.AllowAsideMinimizing, tenantId),
                    DefaultMinimizedAside = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.LeftAside.DefaultMinimizedAside, tenantId),
                    SubmenuToggle = await GetSettingValueForTenantAsync(AppSettings.UiManagement.LeftAside.SubmenuToggle, tenantId),
                    HoverableAside = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.LeftAside.HoverableAside, tenantId),
                    SearchActive = await GetSettingValueForApplicationAsync<bool>(AppSettings.UiManagement.SearchActive)
                },
                Footer = new ThemeFooterSettingsDto
                {
                    FixedFooter = await GetSettingValueForTenantAsync<bool>(AppSettings.UiManagement.Footer.FixedFooter, tenantId)
                }
            };
        }
    }
}
