using System.Collections.Generic;
using Abp.Extensions;
using Microsoft.Extensions.Configuration;
using Realty.Configuration;

namespace Realty.MultiTenancy.Payments.Stripe
{
    public class StripePaymentGatewayConfiguration : IPaymentGatewayConfiguration
    {
        private readonly IConfigurationRoot _appConfiguration;

        public SubscriptionPaymentGatewayType GatewayType => SubscriptionPaymentGatewayType.Stripe;

        public string BaseUrl => _appConfiguration["Payment:Stripe:BaseUrl"].EnsureEndsWith('/');

        public string PublishableKey => _appConfiguration["Payment:Stripe:PublishableKey"];

        public string SecretKey => _appConfiguration["Payment:Stripe:SecretKey"];

        public string WebhookSecret => _appConfiguration["Payment:Stripe:WebhookSecret"];

        public bool IsActive => _appConfiguration["Payment:Stripe:IsActive"].To<bool>();

        public bool SupportsRecurringPayments => true;

        public List<string> PaymentMethodTypes => _appConfiguration.GetSection("Payment:Stripe:PaymentMethodTypes").Get<List<string>>();

        public StripePaymentGatewayConfiguration(IAppConfigurationAccessor configurationAccessor)
        {
            _appConfiguration = configurationAccessor.Configuration;
        }
    }
}