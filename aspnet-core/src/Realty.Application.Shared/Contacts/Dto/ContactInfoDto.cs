using System;
using Abp.Application.Services.Dto;

namespace Realty.Contacts.Dto
{
    public class ContactInfoDto : EntityDto<Guid>
    {
        public string FullName { get; set; }
        public string Signature { get; set; }
        public string Initials { get; set; }
    }
}
