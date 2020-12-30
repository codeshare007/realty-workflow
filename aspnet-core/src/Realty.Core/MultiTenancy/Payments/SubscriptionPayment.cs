using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Editions;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.MultiTenancy;
using Realty.Editions;

namespace Realty.MultiTenancy.Payments
{
    [Table("AppSubscriptionPayments")]
    [MultiTenancySide(MultiTenancySides.Host)]
    public class SubscriptionPayment : FullAuditedEntity<long>
    {
        public string Description { get; set; }

        public SubscriptionPaymentGatewayType Gateway { get; set; }

        public decimal Amount { get; set; }

        public SubscriptionPaymentStatus Status { get; protected set; }

        public int EditionId { get; set; }

        public int TenantId { get; set; }

        public int DayCount { get; set; }

        public PaymentPeriodType? PaymentPeriodType { get; set; }

        public string ExternalPaymentId { get; set; }

        public virtual Edition Edition { get; set; }

        public string InvoiceNo { get; set; }

        public bool IsRecurring { get; set; }

        public string SuccessUrl { get; set; }

        public string ErrorUrl { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public void SetAsCancelled()
        {
            if (Status == SubscriptionPaymentStatus.NotPaid)
            {
                Status = SubscriptionPaymentStatus.Cancelled;
            }
        }

        public void SetAsFailed()
        {
            Status = SubscriptionPaymentStatus.Failed;
        }

        public void SetAsPaid()
        {
            if (Status == SubscriptionPaymentStatus.NotPaid)
            {
                Status = SubscriptionPaymentStatus.Paid;
            }
        }

        public void SetAsCompleted()
        {
            if (Status == SubscriptionPaymentStatus.Paid)
            {
                Status = SubscriptionPaymentStatus.Completed;
            }
        }

        public SubscriptionPayment()
        {
            Status = SubscriptionPaymentStatus.NotPaid;
        }

        public PaymentPeriodType GetPaymentPeriodType()
        {
            switch (DayCount)
            {
                case 1:
                    return Payments.PaymentPeriodType.Daily;
                case 7:
                    return Payments.PaymentPeriodType.Weekly;
                case 30:
                    return Payments.PaymentPeriodType.Monthly;
                case 365:
                    return Payments.PaymentPeriodType.Annual;
                default:
                    throw new NotImplementedException($"PaymentPeriodType for {DayCount} day could not found");
            }
        }

        public bool IsProrationPayment()
        {
            return IsRecurring && EditionPaymentType == EditionPaymentType.Upgrade;
        }
    }
}
