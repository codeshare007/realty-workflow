using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;

namespace Realty.TransactionPaymentTrackers
{
    public class TransactionAdditionalFee : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public decimal Amount { get; set; }
        public string Comment { get; set; }
        
        public int TenantId { get; set; }
    }
}
