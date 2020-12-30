using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Contacts
{
    public class Contact : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public ContactType Type { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string LegalName { get; set; }
        public string PreferredSignature { get; set; }
        public string PreferredInitials { get; set; }
        // Lawyer
        public string Firm { get; set; }
        // Lawyer
        public string Suffix { get; set; }
        // General, Lessee, Lessor, Agent
        public string Company { get; set; }

        public virtual Address Address { get; set; }
    }
}
