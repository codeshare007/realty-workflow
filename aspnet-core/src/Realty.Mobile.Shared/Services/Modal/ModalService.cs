using System.Threading.Tasks;
using Abp.Dependency;
using Realty.Services.Pages;
using Realty.Views;
using Xamarin.Forms;

namespace Realty.Services.Modal
{
    public class ModalService : IModalService, ISingletonDependency
    {
        private readonly IPageService _pageService;

        public ModalService(IPageService pageService)
        {
            _pageService = pageService;
        }

        public async Task ShowModalAsync(Page page)
        {
            if (_pageService.MainPage is NavigationPage navigationPage)
            {
                await navigationPage.Navigation.PushModalAsync(page);
            }
        }

        public async Task ShowModalAsync<TView>(object navigationParameter) where TView : IXamarinView
        {
            var page = await _pageService.CreatePage(typeof(TView), navigationParameter);
            await ShowModalAsync(page);
        }

        public async Task<Page> CloseModalAsync()
        {
            if (_pageService.MainPage is NavigationPage navigationPage)
            {
                return await navigationPage.Navigation.PopModalAsync();
            }

            return null;
        }
    }
}