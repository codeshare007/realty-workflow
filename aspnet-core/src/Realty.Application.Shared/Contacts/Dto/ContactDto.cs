using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Dto
{
    public class ContactDto: EntityDto<Guid>
    {
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

        public DateTime? LastModificationTime { get; set; }

        public AddressDto Address { get; set; }
    }
}
