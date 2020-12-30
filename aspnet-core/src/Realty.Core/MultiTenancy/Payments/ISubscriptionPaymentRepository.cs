using System.Threading.Tasks;
using Abp.Domain.Repositories;

namespace Realty.MultiTenancy.Payments
{
    public interface ISubscriptionPaymentRepository : IRepository<SubscriptionPayment, long>
    {
        Task<SubscriptionPayment> GetByGatewayAndPaymentIdAsync(SubscriptionPaymentGatewayType gateway, string paymentId);

        Task<SubscriptionPayment> GetLastCompletedPaymentOrDefaultAsync(int tenantId, SubscriptionPaymentGatewayType? gateway, bool? isRecurring);

        Task<SubscriptionPayment> GetLastPaymentOrDefaultAsync(int tenantId, SubscriptionPaymentGatewayType? gateway, bool? isRecurring);
    }
}
