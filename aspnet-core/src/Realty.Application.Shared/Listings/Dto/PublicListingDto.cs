using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class PublicListingDto : EntityDto<Guid>
    {
        public string YglID { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string StreetName { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        public string Beds { get; set; }
        public string Baths { get; set; }
        public DateTime? AvailableDate { get; set; }
        public string Price { get; set; }
        public string Fee { get; set; }
        public string Status { get; set; }
        public string Laundry { get; set; }
        public string MlsOfficeName { get; set; }
        public string UnitDescription { get; set; }

        public string Pet { get; set; }
        public string SquareFootage { get; set; }
        public string UnitLevel { get; set; }

        public List<string> Photo { get; set; }
        public List<string> VirtualTour { get; set; }
        public List<string> Feature { get; set; }
        public List<string> Tag { get; set; }
        public List<string> Video { get; set; }
        public virtual ParkingItemDto Parking { get; set; }
    }
}
