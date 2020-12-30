using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Flurl.Http;
using Foundation;
using ImageCircle.Forms.Plugin.iOS;
using Realty.Core;
using Realty.Core.Exception;
using UIKit;
using Realty.ApiClient;
using CachedImageRenderer = FFImageLoading.Forms.Platform.CachedImageRenderer;

namespace Realty
{
    // The UIApplicationDelegate for the application. This class is responsible for launching the 
    // User Interface of the application, as well as listening (and optionally responding) to 
    // application events from iOS.
    [Register("AppDelegate")]
    public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
    {
        //
        // This method is invoked when the application has loaded and is ready to run. In this 
        // method you should instantiate the window, load the UI into it and then make the window
        // visible.
        //
        // You have 17 seconds to return from this method, or iOS will terminate your application.
        //
        public override bool FinishedLaunching(UIApplication app, NSDictionary options)
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomainOnUnhandledException;
            TaskScheduler.UnobservedTaskException += TaskSchedulerOnUnobservedTaskException;

            ApplicationBootstrapper.InitializeIfNeeds<RealtyXamarinIosModule>();

            global::Xamarin.Forms.Forms.Init();

            ImageCircleRenderer.Init();

            CachedImageRenderer.Init();

            DebugServerIpAddresses.Current = "localhost"; //Set this address as your local computer IP. Eg: 192.168.1.120

            ConfigureFlurlHttp();

#if DEBUG
            TrustLocalDeveloperCert();
#endif

            SetExitAction();

            LoadApplication(new App());

            return base.FinishedLaunching(app, options);
        }

        private static void TaskSchedulerOnUnobservedTaskException(object sender, UnobservedTaskExceptionEventArgs unobservedTaskExceptionEventArgs)
        {
            ExceptionHandler.LogException(unobservedTaskExceptionEventArgs.Exception);
            unobservedTaskExceptionEventArgs.SetObserved();
        }

        private static void CurrentDomainOnUnhandledException(object sender, UnhandledExceptionEventArgs unhandledExceptionEventArgs)
        {
            ExceptionHandler.LogException(unhandledExceptionEventArgs.ExceptionObject as Exception);
        }

        private static void SetExitAction()
        {
            App.ExitApplication = () =>
            {
                Thread.CurrentThread.Abort();
            };
        }

        private static void ConfigureFlurlHttp()
        {
            var modernHttpClientFactory = new ModernHttpClientFactory
            {
                OnSessionTimeOut = App.OnSessionTimeout,
                OnAccessTokenRefresh = App.OnAccessTokenRefresh
            };

            FlurlHttp.Configure(c =>
            {
                c.HttpClientFactory = modernHttpClientFactory;
            });
        }

        private static void TrustLocalDeveloperCert()
        {
            System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
        }
    }
}
