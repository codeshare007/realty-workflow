using System;
using Abp.Domain.Entities.Auditing;

namespace Realty.Contacts.Dto
{
    public class ContactListDto: ContactDtoBase, IHasCreationTime
    {
        public DateTime CreationTime { get; set; }
        public string ParticipantInitials { get; set; }
        public string ParticipantName { get; set; }
    }
}
