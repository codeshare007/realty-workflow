using System;

namespace Realty.RecommendedListings.Input
{
    public class CreateRecommendedListingInput
    {
        public Guid LeadId { get; set; }
        public string[] YglListingIds { get; set; }
    }
}
