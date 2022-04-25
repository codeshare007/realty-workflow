using Realty.Listings;
using System;

namespace Realty.RecommendedListings.Input
{
    public class RequestTourInput
    {
        public Guid Id { get; set; }
        public RequestTourTime? RequestedTourTime { get; set; }
        public DateTime? RequestedTourDate { get; set; }
    }
}
