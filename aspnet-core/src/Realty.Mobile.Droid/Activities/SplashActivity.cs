using System.Threading.Tasks;
using Acr.UserDialogs;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Flurl.Http;
using Realty.ApiClient;
using Realty.Core;
using Realty.Localization.Resources;
using Realty.ViewModels.Base;
using Plugin.Connectivity;
using Process = Android.OS.Process;

namespace Realty.Activities
{
    [Activity(Theme = "@style/MyTheme.Splash",
        MainLauncher = true,
        NoHistory = true)]
    public class SplashActivity : AppCompatActivity
    {
        // Launches the startup task
        protected override async void OnResume()
        {
            base.OnResume();
            ApplicationBootstrapper.InitializeIfNeeds<RealtyXamarinAndroidModule>();
            await CheckInternetAndStartApplication();
        }

        public override void OnBackPressed()
        {
            // Prevent the back button from canceling the startup process
        }

        private async Task CheckInternetAndStartApplication()
        {
            if (CrossConnectivity.Current.IsConnected || ApiUrlConfig.IsLocal)
            {
                await StartApplication();
            }
            else
            {
                var isTryAgain = await UserDialogs.Instance.ConfirmAsync(LocalTranslation.NoInternet, LocalTranslation.MessageTitle);
                if (!isTryAgain)
                {
                    App.ExitApplication();
                }

                await CheckInternetAndStartApplication();
            }
        }

        /// <summary>
        ///  Performing some startup work that takes a bit of time
        /// </summary>
        private async Task StartApplication()
        {
            /*
              If you are using Genymotion Emulator, set DebugServerIpAddresses.Current = "10.0.3.2".
              If you are using a real Android device, set it as your computer's local IP and 
                 make sure your Android device and your computer is connecting to the internet via your local Wi-Fi.
           */
            DebugServerIpAddresses.Current = "10.0.2.2";

            App.LoadPersistedSession();

            await UserConfigurationManager.GetIfNeedsAsync();

            StartActivity(new Intent(Application.Context, typeof(MainActivity)));
        }

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            UserDialogs.Init(this);

            ConfigureFlurlHttp();

            SetExitAction();
        }

        private static void SetExitAction()
        {
            App.ExitApplication = () =>
            {
                Process.KillProcess(Process.MyPid());
            };
        }

        private static void ConfigureFlurlHttp()
        {
            var abpHttpClientFactory = new ModernHttpClientFactory
            {
                OnSessionTimeOut = App.OnSessionTimeout,
                OnAccessTokenRefresh = App.OnAccessTokenRefresh
            };

            FlurlHttp.Configure(c =>
            {
                c.HttpClientFactory = abpHttpClientFactory;
            });
        }
    }
}