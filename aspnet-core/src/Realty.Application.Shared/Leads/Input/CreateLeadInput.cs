using Realty.Contacts.Dto;
using System;

namespace Realty.Leads.Input
{
    public class CreateLeadInput
    {
        public LeadStatus Status { get; set; }
        public LeadSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalId { get; set; }
        public string Notes { get; set; }

        public ContactDto Contact { get; set; }

        public Guid? AgentId { get; set; }
        public Guid? CustomerId { get; set; }

        public decimal? MinBath { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent { get; set; }
        public DateTime? MoveFrom { get; set; }
        public DateTime? MoveTo { get; set; }

        public string Tags { get; set; }
        public string Cities { get; set; }
        public string Pets { get; set; }
        public string Beds { get; set; }
    }
}
