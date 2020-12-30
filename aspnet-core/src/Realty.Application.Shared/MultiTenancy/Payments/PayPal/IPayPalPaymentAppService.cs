using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.MultiTenancy.Payments.PayPal.Dto;

namespace Realty.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
