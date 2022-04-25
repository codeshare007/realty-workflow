using System;
using Abp.Domain.Entities.Auditing;

namespace Realty.Contacts.Dto
{
    public class ContactDto: ContactDtoBase, IHasModificationTime
    {
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
