using Abp.Application.Services.Dto;
using System;

namespace Realty.RecommendedListings.Dto
{
    public class RecommendedListingListDto : EntityDto<Guid>
    {
        public string City { get; set; }
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string Unit { get; set; }
        public string Price { get; set; }
        public string Beds { get; set; }
        public string BedInfo { get; set; }
        public string Baths { get; set; }
        public string Fee { get; set; }
        public DateTime AvailableDate { get; set; }
        public string Landlord { get; set; }
        public Guid LandlordId { get; set; }
        public Guid ListingId { get; set; }
        public string YglListingId { get; set; }
        public DateTime AddedOn { get; set; }
        public int DisplayOrder { get; set; }
    }
}
  

