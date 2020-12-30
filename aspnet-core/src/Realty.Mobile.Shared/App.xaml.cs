using System;
using System.Threading.Tasks;
using Realty.ApiClient;
using Realty.Core.Dependency;
using Realty.Localization.Resources;
using Realty.Services.Account;
using Realty.Services.Navigation;
using Realty.Services.Storage;
using Realty.ViewModels.Base;
using Xamarin.Forms;

namespace Realty
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            InstallFontPlugins();
        }

        public static Action ExitApplication;

        public static async Task OnSessionTimeout()
        {
            await DependencyResolver.Resolve<IAccountService>().LogoutAsync();
        }

        public static async Task OnAccessTokenRefresh(string newAccessToken)
        {
            await DependencyResolver.Resolve<IDataStorageService>().StoreAccessTokenAsync(newAccessToken);
        }


        public static void LoadPersistedSession()
        {
            var accessTokenManager = DependencyResolver.Resolve<IAccessTokenManager>();
            var dataStorageService = DependencyResolver.Resolve<IDataStorageService>();
            var applicationContext = DependencyResolver.Resolve<IApplicationContext>();

            accessTokenManager.AuthenticateResult = dataStorageService.RetrieveAuthenticateResult();
            applicationContext.Load(dataStorageService.RetrieveTenantInfo(), dataStorageService.RetrieveLoginInfo());
        }

        protected override async void OnStart()
        {
            base.OnStart();

            if (Device.RuntimePlatform == Device.iOS)
            {
                SetInitialScreenForIos();
                await UserConfigurationManager.GetIfNeedsAsync();
            }

            await DependencyResolver.Resolve<INavigationService>().InitializeAsync();

            OnResume();
        }

        private void SetInitialScreenForIos()
        {
            MainPage = new ContentPage
            {
                BackgroundColor = (Color)Current.Resources["LoginBackgroundColor"],
                Content = new StackLayout
                {
                    VerticalOptions = LayoutOptions.Center,
                    HorizontalOptions = LayoutOptions.Center,
                    Children =
                    {
                        new ActivityIndicator
                        {
                            IsRunning = true,
                            Color = Color.White
                        },
                        new Label
                        {
                            Text = LocalTranslation.Initializing,
                            TextColor = Color.White,
                            HorizontalTextAlignment = TextAlignment.Center,
                            VerticalTextAlignment = TextAlignment.Center
                        }
                    }
                }
            };
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        /// <summary>
        /// https://github.com/jsmarcus/Xamarin.Plugins/tree/master/Iconize
        /// </summary>
        private static void InstallFontPlugins()
        {
            Plugin.Iconize.Iconize
                .With(new Plugin.Iconize.Fonts.FontAwesomeSolidModule())
                .With(new Plugin.Iconize.Fonts.MaterialModule());

            /*
            // FontAwesome 5 Solid Icons:
            // You can get the list of icon keys with the below code 
            // Alternatively, you can visit http://aalmiray.github.io/ikonli/cheat-sheet-fontawesome5.html#_solid
            foreach (var module in Plugin.Iconize.Iconize.Modules)
            {
                var iconsList = module.Keys.ToList();
            }
            */
        }
    }
}
