using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.MultiTenancy.Payments.Dto;
using Realty.MultiTenancy.Payments.Stripe.Dto;

namespace Realty.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}