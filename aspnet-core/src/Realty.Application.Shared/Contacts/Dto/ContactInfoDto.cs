using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Dto
{
    public class ContactInfoDto: EntityDto<Guid>
    {
        public ContactType Type { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
