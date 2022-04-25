using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Dto
{
    public abstract class ContactDtoBase: EntityDto<Guid>
    {
        public ContactType Type { get; set; }
        
        public string FirstName { get; set; }
        
        public string MiddleName { get; set; }
        
        public string LastName { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }
    }
}
