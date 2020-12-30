using Abp.Extensions;
using Microsoft.Extensions.Configuration;
using Realty.Configuration;

namespace Realty.MultiTenancy.Payments.Paypal
{
    public class PayPalPaymentGatewayConfiguration : IPaymentGatewayConfiguration
    {
        private readonly IConfigurationRoot _appConfiguration;

        public SubscriptionPaymentGatewayType GatewayType => SubscriptionPaymentGatewayType.Paypal;

        public string Environment => _appConfiguration["Payment:PayPal:Environment"];

        public string ClientId => _appConfiguration["Payment:PayPal:ClientId"];

        public string ClientSecret => _appConfiguration["Payment:PayPal:ClientSecret"];

        public string DemoUsername => _appConfiguration["Payment:PayPal:DemoUsername"];

        public string DemoPassword => _appConfiguration["Payment:PayPal:DemoPassword"];

        public bool IsActive => _appConfiguration["Payment:PayPal:IsActive"].To<bool>();

        public bool SupportsRecurringPayments => false;
        
        public PayPalPaymentGatewayConfiguration(IAppConfigurationAccessor configurationAccessor)
        {
            _appConfiguration = configurationAccessor.Configuration;
        }
    }
}