using Abp.AspNetCore.Mvc.Views;

namespace Realty.Web.Views
{
    public abstract class RealtyRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected RealtyRazorPage()
        {
            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }
    }
}
