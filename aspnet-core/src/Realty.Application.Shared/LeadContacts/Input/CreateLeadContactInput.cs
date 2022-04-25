using Realty.Contacts.Dto;
using Realty.LeadContacts.Dto;
using System;

namespace Realty.LeadContacts.Input
{
    public class CreateLeadContactInput
    {
        public LeadContactDto Contact { get; set; }

        public Guid LeadId { get; set; }
    }
}
