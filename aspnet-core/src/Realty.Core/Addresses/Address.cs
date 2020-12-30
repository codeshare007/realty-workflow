using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Contacts
{
    public class Address : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string UnitNumber { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
