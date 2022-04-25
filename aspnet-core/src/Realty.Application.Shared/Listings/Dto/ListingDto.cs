using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class ListingDto : EntityDto<Guid>
    {
        public Guid ListingId { get; set; }

        public ListingSource Source { get; set; }
        public string ExternalSource { get; set; }
        public string ExternalID { get; set; }

        public string YglID { get; set; }

        public string StreetNumber { get; set; }
        public string StreetName { get; set; }
        public string City { get; set; }
        public string Neighborhood { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Unit { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }

        public string Beds { get; set; }
        public string BedInfo { get; set; }
        public string Room { get; set; }
        public string Baths { get; set; }
        public string BuildingType { get; set; }
        public string HeatSource { get; set; }
        public string StudentPolicy { get; set; }

        public DateTime? AvailableDate { get; set; }
        public string Price { get; set; }
        public string Fee { get; set; }
        public string Status { get; set; }
        public string Laundry { get; set; }
        public string IncludeElectricity { get; set; }
        public string IncludeGas { get; set; }
        public string IncludeHeat { get; set; }
        public string IncludeHotWater { get; set; }
        public string ListingAgentID { get; set; }
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
        public virtual MoveInCostsDto MoveInCosts { get; set; }
    }

    public class ParkingItemDto
    {
        public string Availability { get; set; }
        public string ParkingNumber { get; set; }
        public string Type { get; set; }
        public string ParkingPrice { get; set; }
    }

    public class MoveInCostsDto
    {
        public bool IsFirstMonthRequired { get; set; }
        public bool IsLastMonthRequired { get; set; }
        public decimal PetDeposit { get; set; }
        public decimal Fee { get; set; }
        public decimal KeyDeposit { get; set; }
        public decimal SecurityDeposit { get; set; }
        public decimal ApplicationFee { get; set; }
    }

    public enum ListingDetailType
    {
        Feature,
        Tag,
        Photo,
        Photos360,
        Video,
        RentInclude
    }

    public enum ListingSource
    {
        Manual,
        YGL
    }
}
