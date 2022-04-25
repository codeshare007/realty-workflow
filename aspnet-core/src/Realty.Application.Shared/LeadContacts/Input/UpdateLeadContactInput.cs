using Realty.LeadContacts.Dto;
using System;

namespace Realty.LeadContacts.Input
{
    public class UpdateLeadContactInput
    {
        public LeadContactDto Contact { get; set; }

        public Guid LeadId { get; set; }
    }
}
