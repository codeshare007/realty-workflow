using System.Collections.Generic;

namespace Realty.Listings.Dto
{
    public class ListingResposeDto
    {
        public string Source { get; set; }
        public string ID { get; set; }
        public string ExternalID { get; set; }
        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string City { get; set; }
        public string Neighborhood { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Unit { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string CreateDate { get; set; }
        public string UpdateDate { get; set; }
        public string Beds { get; set; }
        public string BedInfo { get; set; }
        public string Room { get; set; }
        public string Baths { get; set; }
        public string AvailableDate { get; set; }
        public string Price { get; set; }
        public string Fee { get; set; }
        public string Status { get; set; }
        public string Laundry { get; set; }
        public string IncludeElectricity { get; set; }
        public string IncludeGas { get; set; }
        public string IncludeHeat { get; set; }
        public string IncludeHotWater { get; set; }
        public string ListingAgentID { get; set; }
        public List<string> RentInclude { get; set; }
        public List<string> Photo { get; set; }
        public List<string> VirtualTour { get; set; }
        public string Pet { get; set; }
        public string UnitLevel { get; set; }
        public List<string> Video { get; set; }
        public ParkingDto Parking { get; set; }
    }

    public class ParkingDto
    {
        public string ParkingAvailability { get; set; }
        public string ParkingType { get; set; }
    }
}
  

