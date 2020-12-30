using Abp.AspNetCore.Mvc.ViewComponents;

namespace Realty.Web.Public.Views
{
    public abstract class RealtyViewComponent : AbpViewComponent
    {
        protected RealtyViewComponent()
        {
            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }
    }
}