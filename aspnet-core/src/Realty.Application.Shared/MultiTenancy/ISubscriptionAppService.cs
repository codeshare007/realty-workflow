using System.Threading.Tasks;
using Abp.Application.Services;

namespace Realty.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
