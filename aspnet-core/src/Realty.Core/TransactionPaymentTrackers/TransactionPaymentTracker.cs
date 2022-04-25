using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Realty.TransactionPaymentTrackers
{
    public class TransactionPaymentTracker : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        private List<TransactionAdditionalFee> _additionalFees = new List<TransactionAdditionalFee>();
        private List<Payment> _payments = new List<Payment>();
        
        public decimal FirstPayment { get; set; }
        public decimal LastPayment { get; set; }
        public decimal SecurityPayment { get; set; }
        public decimal KeyPayment { get; set; }
        public decimal OtherPayment { get; set; }
        public decimal FeePayment { get; set; }
        public float TenantFeePercentage { get; set; }
        public float LandlordFeePercentage { get; set; }
        public float AgentFeePercentage { get; set; }
        public bool IsWithholdingFee { get; set; }

        public int TenantId { get; set; }

        public virtual IReadOnlyCollection<Payment> Payments => _payments.AsReadOnly();
        public virtual IReadOnlyCollection<TransactionAdditionalFee> AdditionalFees => _additionalFees.AsReadOnly();

        public void RemovePayment(Payment payment)
        {
            Check.NotNull(payment, nameof(payment));

            var currentPayment = Payments.ToList().First(p => p.Id == payment.Id);
            payment.IsDeleted = true;
        }

        public void AddPayment(Payment payment)
        {
            Check.NotNull(payment, nameof(payment));

            _payments.Add(payment);
        }
        public void RemoveAdditionalFee(TransactionAdditionalFee additionalFee)
        {
            Check.NotNull(additionalFee, nameof(additionalFee));

            _additionalFees.Remove(additionalFee);
        }

        public void AddAdditionalFee(TransactionAdditionalFee additionalFee)
        {
            Check.NotNull(additionalFee, nameof(additionalFee));

            _additionalFees.Add(additionalFee);
        }
    }
}
