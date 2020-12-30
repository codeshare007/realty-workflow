using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Threading;
using Realty.Editions;
using Stripe;

namespace Realty.MultiTenancy.Payments.Stripe
{
    public class StripeGatewayManager : RealtyServiceBase,
        ISupportsRecurringPayments,
        ITransientDependency
    {
        private readonly TenantManager _tenantManager;
        private readonly EditionManager _editionManager;
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;

        public static string ProductName = "Realty";
        public static string StripeSessionIdSubscriptionPaymentExtensionDataKey = "StripeSessionId";

        public StripeGatewayManager(
            TenantManager tenantManager,
            ISubscriptionPaymentRepository subscriptionPaymentRepository,
            EditionManager editionManager)
        {
            _tenantManager = tenantManager;
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _editionManager = editionManager;
        }

        public async Task UpdateSubscription(int newEditionId, int tenantId, bool isProrateCharged = false)
        {
            var lastPayment = await _subscriptionPaymentRepository.GetLastCompletedPaymentOrDefaultAsync(
                tenantId: tenantId,
                SubscriptionPaymentGatewayType.Stripe,
                isRecurring: true);

            string newPlanId;
            decimal? newPlanAmount;

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var edition = (SubscribableEdition)AsyncHelper.RunSync(() => _editionManager.GetByIdAsync(newEditionId));
                newPlanId = GetPlanId(edition.Name, lastPayment.GetPaymentPeriodType());
                newPlanAmount = edition.GetPaymentAmount(lastPayment.PaymentPeriodType);
            }

            if (!(await DoesPlanExistAsync(newPlanId)))
            {
                await CreatePlanAsync(
                    newPlanId,
                    newPlanAmount.Value,
                    GetPlanInterval(lastPayment.PaymentPeriodType),
                    ProductName
                );
            }

            await UpdateSubscription(lastPayment.ExternalPaymentId, newPlanId, isProrateCharged);
        }

        private async Task UpdateSubscription(string subscriptionId, string newPlanId, bool isProrateCharged = false)
        {
            var subscriptionService = new SubscriptionService();
            var subscription = await subscriptionService.GetAsync(subscriptionId);

            await subscriptionService.UpdateAsync(subscriptionId, new SubscriptionUpdateOptions
            {
                CancelAtPeriodEnd = false,
                Items = new List<SubscriptionItemOptions> {
                    new SubscriptionItemOptions {
                        Id = subscription.Items.Data[0].Id,
                        Plan = newPlanId
                    }
                },
                Prorate = !isProrateCharged
            });

            var lastRecurringPayment = await _subscriptionPaymentRepository.GetByGatewayAndPaymentIdAsync(SubscriptionPaymentGatewayType.Stripe, subscriptionId);
            var payment = await _subscriptionPaymentRepository.GetLastPaymentOrDefaultAsync(
                tenantId: lastRecurringPayment.TenantId,
                SubscriptionPaymentGatewayType.Stripe,
                isRecurring: true);

            payment.IsRecurring = false;
        }

        public async Task CancelSubscription(string subscriptionId)
        {
            var subscriptionService = new SubscriptionService();
            await subscriptionService.CancelAsync(subscriptionId, null);

            var payment = await _subscriptionPaymentRepository.GetByGatewayAndPaymentIdAsync(
                SubscriptionPaymentGatewayType.Stripe,
                subscriptionId
            );

            payment.SetAsCancelled();
        }

        public async Task<bool> DoesPlanExistAsync(string planId)
        {
            try
            {
                var planService = new PlanService();
                await planService.GetAsync(planId);

                return true;
            }
            catch (StripeException)
            {
                return false;
            }
        }

        public async Task<StripeIdResponse> GetOrCreatePlanAsync(string planId, decimal amount, string interval, string productId)
        {
            try
            {
                var planService = new PlanService();
                var plan = await planService.GetAsync(planId);

                return new StripeIdResponse
                {
                    Id = plan.Id
                };
            }
            catch (StripeException)
            {
                return await CreatePlanAsync(planId, amount, interval, productId);
            }
        }

        public async Task<StripeIdResponse> GetOrCreateProductAsync(string productId)
        {
            try
            {
                var productService = new ProductService();
                var product = await productService.GetAsync(productId);

                return new StripeIdResponse
                {
                    Id = product.Id
                };
            }
            catch (StripeException exception)
            {
                Logger.Error(exception.Message, exception);
                return await CreateProductAsync(productId);
            }
        }

        public string GetPlanInterval(PaymentPeriodType? paymentPeriod)
        {
            if (!paymentPeriod.HasValue)
            {
                throw new ArgumentNullException(nameof(paymentPeriod));
            }

            switch (paymentPeriod.Value)
            {
                case PaymentPeriodType.Daily:
                    return "day";
                case PaymentPeriodType.Weekly:
                    return "week";
                case PaymentPeriodType.Monthly:
                    return "month";
                case PaymentPeriodType.Annual:
                    return "year";
                default:
                    throw new NotImplementedException($"The plan interval for {paymentPeriod} is not implemented");
            }
        }

        public void HandleEvent(RecurringPaymentsDisabledEventData eventData)
        {
            var subscriptionPayment = GetLastCompletedSubscriptionPayment(eventData.TenantId);

            int daysUntilDue;

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var edition = (SubscribableEdition)AsyncHelper.RunSync(() => _editionManager.GetByIdAsync(eventData.EditionId));
                daysUntilDue = edition.WaitingDayAfterExpire ?? 3;
            }

            var subscriptionService = new SubscriptionService();
            subscriptionService.Update(subscriptionPayment.ExternalPaymentId, new SubscriptionUpdateOptions
            {
                CancelAtPeriodEnd = false,
                CollectionMethod = "send_invoice",
                DaysUntilDue = daysUntilDue
            });
        }

        public void HandleEvent(RecurringPaymentsEnabledEventData eventData)
        {
            var subscriptionPayment = GetLastCompletedSubscriptionPayment(eventData.TenantId);

            if (subscriptionPayment == null || subscriptionPayment.ExternalPaymentId.IsNullOrEmpty())
            {
                return;
            }

            var subscriptionService = new SubscriptionService();
            subscriptionService.Update(subscriptionPayment.ExternalPaymentId, new SubscriptionUpdateOptions
            {
                CancelAtPeriodEnd = false,
                CollectionMethod = "charge_automatically"
            });
        }

        public void HandleEvent(TenantEditionChangedEventData eventData)
        {
            if (!eventData.OldEditionId.HasValue)
            {
                return;
            }

            var subscriptionPayment = GetLastCompletedSubscriptionPayment(eventData.TenantId);

            if (subscriptionPayment == null || subscriptionPayment.ExternalPaymentId.IsNullOrEmpty())
            {
                // no subscription on stripe !
                return;
            }

            if (!eventData.NewEditionId.HasValue)
            {
                AsyncHelper.RunSync(() => CancelSubscription(subscriptionPayment.ExternalPaymentId));
                return;
            }

            string newPlanId;
            decimal? newPlanAmount;

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var edition = (SubscribableEdition)AsyncHelper.RunSync(() => _editionManager.GetByIdAsync(eventData.NewEditionId.Value));
                newPlanId = GetPlanId(edition.Name, subscriptionPayment.GetPaymentPeriodType());
                newPlanAmount = edition.GetPaymentAmountOrNull(subscriptionPayment.PaymentPeriodType);
            }

            if (!newPlanAmount.HasValue || newPlanAmount.Value == 0)
            {
                AsyncHelper.RunSync(() => CancelSubscription(subscriptionPayment.ExternalPaymentId));
                return;
            }

            var payment = new SubscriptionPayment
            {
                TenantId = eventData.TenantId,
                Amount = 0,
                PaymentPeriodType = subscriptionPayment.GetPaymentPeriodType(),
                Description = $"Edition change by admin from {eventData.OldEditionId} to {eventData.NewEditionId}",
                EditionId = eventData.NewEditionId.Value,
                Gateway = SubscriptionPaymentGatewayType.Stripe,
                DayCount = subscriptionPayment.DayCount,
                IsRecurring = true
            };

            _subscriptionPaymentRepository.InsertAndGetId(payment);

            CurrentUnitOfWork.SaveChanges();

            if (!AsyncHelper.RunSync(() => DoesPlanExistAsync(newPlanId)))
            {
                AsyncHelper.RunSync(() => CreatePlanAsync(newPlanId, newPlanAmount.Value, GetPlanInterval(subscriptionPayment.PaymentPeriodType), ProductName));
            }

            AsyncHelper.RunSync(() => UpdateSubscription(subscriptionPayment.ExternalPaymentId, newPlanId));
        }

        public async Task HandleInvoicePaymentSucceededAsync(Invoice invoice)
        {
            var customerService = new CustomerService();
            var customer = await customerService.GetAsync(invoice.CustomerId);

            int tenantId;
            int editionId;

            PaymentPeriodType? paymentPeriodType;

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await _tenantManager.FindByTenancyNameAsync(customer.Description);
                tenantId = tenant.Id;
                editionId = tenant.EditionId.Value;

                using (CurrentUnitOfWork.SetTenantId(tenantId))
                {
                    var lastPayment = GetLastCompletedSubscriptionPayment(tenantId);
                    paymentPeriodType = lastPayment.GetPaymentPeriodType();
                }

                await _tenantManager.UpdateTenantAsync(
                    tenant.Id,
                    isActive: true,
                    isInTrialPeriod: false,
                    paymentPeriodType,
                    tenant.EditionId.Value,
                    EditionPaymentType.Extend);
            }

            var payment = new SubscriptionPayment
            {
                TenantId = tenantId,
                Amount = ConvertFromStripePrice(invoice.AmountPaid),
                DayCount = (int)paymentPeriodType,
                PaymentPeriodType = paymentPeriodType,
                EditionId = editionId,
                ExternalPaymentId = invoice.ChargeId,
                Gateway = SubscriptionPaymentGatewayType.Stripe,
                IsRecurring = true
            };

            payment.SetAsPaid();

            await _subscriptionPaymentRepository.InsertAsync(payment);
        }

        public string GetPlanId(string editionName, PaymentPeriodType paymentPeriodType)
        {
            return editionName + "_" + paymentPeriodType + "_" + RealtyConsts.Currency;
        }

        public long ConvertToStripePrice(decimal amount)
        {
            return Convert.ToInt64(amount * 100);
        }

        public decimal ConvertFromStripePrice(long amount)
        {
            return Convert.ToDecimal(amount) / 100;
        }

        private SubscriptionPayment GetLastCompletedSubscriptionPayment(int tenantId)
        {
            return _subscriptionPaymentRepository.GetAll()
                .Where(p =>
                    p.TenantId == tenantId &&
                    p.Status == SubscriptionPaymentStatus.Completed &&
                    p.Gateway == SubscriptionPaymentGatewayType.Stripe &&
                    p.ExternalPaymentId.StartsWith("sub"))
                .OrderByDescending(x => x.Id)
                .FirstOrDefault();
        }

        private async Task<StripeIdResponse> CreatePlanAsync(string planId, decimal amount, string interval, string productId)
        {
            var planService = new PlanService();
            var plan = await planService.CreateAsync(new PlanCreateOptions
            {
                Id = planId,
                Amount = ConvertToStripePrice(amount),
                Interval = interval,
                Product = productId,
                Currency = RealtyConsts.Currency
            });

            return new StripeIdResponse
            {
                Id = plan.Id
            };
        }

        private async Task<StripeIdResponse> CreateProductAsync(string name)
        {
            var productService = new ProductService();
            var product = await productService.CreateAsync(new ProductCreateOptions
            {
                Id = name,
                Name = name,
                Type = "service"
            });

            return new StripeIdResponse
            {
                Id = product.Id
            };
        }

        public async Task<StripeIdResponse> GetOrCreatePlanForPayment(long paymentId)
        {
            var payment = await _subscriptionPaymentRepository.GetAsync(paymentId);

            string planId;
            decimal amount;
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var edition = (SubscribableEdition)await _editionManager.GetByIdAsync(payment.EditionId);
                planId = GetPlanId(edition.Name, payment.GetPaymentPeriodType());
                amount = edition.GetPaymentAmount(payment.GetPaymentPeriodType());
            }

            var product = await GetOrCreateProductAsync(ProductName);
            var planInterval = GetPlanInterval(payment.PaymentPeriodType);


            return await GetOrCreatePlanAsync(planId, amount, planInterval, product.Id);
        }
    }
}