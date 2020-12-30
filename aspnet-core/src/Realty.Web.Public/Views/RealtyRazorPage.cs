using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Realty.Web.Public.Views
{
    public abstract class RealtyRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected RealtyRazorPage()
        {
            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }
    }
}
