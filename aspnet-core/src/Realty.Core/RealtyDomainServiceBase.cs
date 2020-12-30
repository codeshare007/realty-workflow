using Abp.Domain.Services;

namespace Realty
{
    public abstract class RealtyDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected RealtyDomainServiceBase()
        {
            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }
    }
}
