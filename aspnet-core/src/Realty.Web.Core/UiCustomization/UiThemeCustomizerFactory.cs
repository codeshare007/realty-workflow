using System;
using System.Threading.Tasks;
using Abp.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Realty.Configuration;
using Realty.UiCustomization;
using Realty.Web.UiCustomization.Metronic;

namespace Realty.Web.UiCustomization
{
    public class UiThemeCustomizerFactory : IUiThemeCustomizerFactory
    {
        private readonly ISettingManager _settingManager;
        private readonly IServiceProvider _serviceProvider;

        public UiThemeCustomizerFactory(
            ISettingManager settingManager,
            IServiceProvider serviceProvider)
        {
            _settingManager = settingManager;
            _serviceProvider = serviceProvider;
        }

        public async Task<IUiCustomizer> GetCurrentUiCustomizer()
        {
            var theme = await _settingManager.GetSettingValueAsync(AppSettings.UiManagement.Theme);
            return GetUiCustomizerInternal(theme);
        }

        public IUiCustomizer GetUiCustomizer(string theme)
        {
            return GetUiCustomizerInternal(theme);
        }

        private IUiCustomizer GetUiCustomizerInternal(string theme)
        {
            if (theme.Equals(AppConsts.Theme8, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme8UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme2, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme2UiCustomizer>();
            }


            if (theme.Equals(AppConsts.Theme4, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme4UiCustomizer>();
            }
            
            if (theme.Equals(AppConsts.Theme5, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme5UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme11, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme11UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme3, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme3UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme6, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme6UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme9, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme9UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme7, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme7UiCustomizer>();
            }

            if (theme.Equals(AppConsts.Theme10, StringComparison.InvariantCultureIgnoreCase))
            {
                return _serviceProvider.GetService<Theme10UiCustomizer>();
            }

            return _serviceProvider.GetService<ThemeDefaultUiCustomizer>();
        }
    }
}
