using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Contacts;
using Realty.Signings;

namespace Realty.Signings
{
    public class SigningContact : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public Guid? SigningId { get; set; }
        public Guid? ContactId { get; set; }

        public virtual Signing Signing { get; set; }
        public virtual Contact Contact { get; set; }
    }
}
