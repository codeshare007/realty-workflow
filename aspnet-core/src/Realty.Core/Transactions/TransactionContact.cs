using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Contacts;

namespace Realty.Transactions
{
    public class TransactionContact : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public Guid? TransactionId { get; set; }
        public Guid? ContactId { get; set; }

        public virtual Transaction Transaction { get; set; }
        public virtual Contact Contact { get; set; }
    }
}
