using Abp.Application.Services.Dto;
using Realty.Listings;
using Realty.Listings.Dto;
using System;

namespace Realty.RecommendedListings.Dto
{
    public class RecommendedListingDto : EntityDto<Guid>
    {
        public RequestTourTime? RequestedTourTime { get; set; }
        public DateTime? RequestedTourDate { get; set; }
        public string LeadQuestion { get; private set; }

        public ListingDto Listing { get; set; }
    }
}
  

