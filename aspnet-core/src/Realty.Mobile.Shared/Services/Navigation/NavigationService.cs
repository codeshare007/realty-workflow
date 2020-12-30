using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Realty.ApiClient;
using Realty.Services.Pages;
using Realty.Services.Storage;
using Realty.Views;
using Xamarin.Forms;

namespace Realty.Services.Navigation
{
    public class NavigationService : INavigationService, ISingletonDependency
    {
        private readonly IAccessTokenManager _accessTokenManager;
        private readonly IPageService _pageService;
        private readonly IDataStorageService _dataStorageService;
        private readonly IApplicationContext _applicationContext;

        public NavigationService(IAccessTokenManager accessTokenManager,
            IPageService pageService,
            IApplicationContext applicationContext,
            IDataStorageService dataStorageService)
        {
            _accessTokenManager = accessTokenManager;
            _pageService = pageService;
            _applicationContext = applicationContext;
            _dataStorageService = dataStorageService;
        }

        public async Task InitializeAsync()
        {
            //LoadPersistedSession();

            if (_accessTokenManager.IsUserLoggedIn)
            {
                await SetMainPage<MainView>();
            }
            else
            {
                await SetMainPage<LoginView>(clearNavigationHistory: true);
            }
        }

        //private void LoadPersistedSession()
        //{
        //    _accessTokenManager.AuthenticateResult = _dataStorageService.RetrieveAuthenticateResult();
        //    _applicationContext.Load(_dataStorageService.RetrieveTenantInfo(), _dataStorageService.RetrieveLoginInfo());
        //}

        public async Task SetMainPage<TView>(object navigationParameter = null, bool clearNavigationHistory = false) where TView : IXamarinView
        {
            var page = await _pageService.CreatePage(typeof(TView), navigationParameter);

            if (_pageService.MainPage is NavigationPage navigationPage)
            {
                if (clearNavigationHistory)
                {
                    _pageService.MainPage = new NavigationPage(page); //TODO: Can clear in a different way? And release views..?
                }
                else
                {
                    await navigationPage.Navigation.PushAsync(page);
                }
            }
            else
            {
                _pageService.MainPage = new NavigationPage(page);
            }
        }

        public async Task SetDetailPageAsync(Type viewType, object navigationParameter = null, bool pushToStack = false)
        {
            var currentPage = _pageService.MainPage;

            if (currentPage is NavigationPage)
            {
                currentPage = currentPage.Navigation.NavigationStack.Last();
            }

            if (!(currentPage is MasterDetailPage masterDetailPage))
            {
                throw new Exception($"Current MainPage is not a {typeof(MasterDetailPage)}!");
            }

            var newPage = await _pageService.CreatePage(viewType, navigationParameter);

            if (pushToStack && masterDetailPage.Detail is NavigationPage navPage)
            {
                await navPage.PushAsync(newPage);
            }
            else
            {
                masterDetailPage.Detail = new NavigationPage(newPage);
            }
        }

        public async Task<Page> GoBackAsync()
        {
            if (_pageService.MainPage is NavigationPage navigationPage)
            {
                var currentPage = navigationPage.Navigation.NavigationStack.Last();
                if (currentPage is MasterDetailPage masterDetail && masterDetail.Detail is NavigationPage detailNavigationPage)
                {
                    if (detailNavigationPage.Navigation.NavigationStack.Count > 1)
                    {
                        return await detailNavigationPage.Navigation.PopAsync();
                    }
                }

                return await navigationPage.Navigation.PopAsync();
            }
            else if (_pageService.MainPage is MasterDetailPage masterDetail && masterDetail.Detail is NavigationPage detailNavigationPage)
            {
                return await detailNavigationPage.Navigation.PopAsync();
            }

            return null;
        }
    }
}