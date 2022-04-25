using Abp.Application.Services.Dto;
using Realty.Listings.Dto;
using System;

namespace Realty.RecommendedListings.Dto
{
    public class RecommendedPublicListingDto : EntityDto<Guid>
    {
        public int DisplayOrder { get; set; }
        public DateTime LastViewDate { get; set; }
        public DateTime RequestedTourDate { get; set; }
        public string LeadQuestion { get; set; }
        public PublicListingDto Listing { get; set; }

        public string AgentFullName { get; set; }
        public string AgentPhone { get; set; }
        public string AgentEmail { get; set; }
        public int TenantId { get; set; }

    }
}
  

