using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Realty.Contacts.Dto;

namespace Realty.Leads.Dto
{
    public class LeadEditDto: EntityDto<Guid>
    {
        public LeadStatus Status { get; set; }
        public LeadSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalId { get; set; }
        public string Notes { get; set; }

        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string Zip { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent { get; set; }

        public DateTime? MoveFrom { get; set; }
        public DateTime? MoveTo { get; set; }

        public string[] Tags { get; set; }
        public string[] Cities { get; set; }
        public string[] Pets { get; set; }
        public string[] Bedrooms { get; set; }
        public string[] Bathrooms { get; set; }
        public Guid? AgentId { get; set; }
        public Guid? CustomerId { get; set; }
        public string Agent { get; set; }
        public string Customer { get; set; }
        public ContactDto Contact { get; set; }
    }
}
