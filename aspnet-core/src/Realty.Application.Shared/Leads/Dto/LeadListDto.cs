using System;
using Abp.Application.Services.Dto;
using Realty.Contacts.Dto;

namespace Realty.Leads.Dto
{
    public class LeadListDto: EntityDto<Guid>
    {
        public ContactInfoDto Contact { get; set; }

        public LeadStatus Status { get; set; }
        public LeadSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalId { get; set; }
        public decimal? MinRent { get; set; }

        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }

        public string Beds { get; set; }
        public string Agent { get; set; }
        public string Customer { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
