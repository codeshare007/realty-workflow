using System.Collections.Generic;
using System.Xml.Serialization;

namespace Realty.Listings
{
	[XmlRoot(ElementName = "Listing")]
	public class JGLListing
	{
		[XmlElement(ElementName = "Source")]
		public string Source { get; set; }
		[XmlElement(ElementName = "ID")]
		public string ID { get; set; }
		[XmlElement(ElementName = "ExternalID")]
		public string ExternalID { get; set; }
		[XmlElement(ElementName = "StreetNumber")]
		public string StreetNumber { get; set; }
		[XmlElement(ElementName = "StreetName")]
		public string StreetName { get; set; }
		[XmlElement(ElementName = "City")]
		public string City { get; set; }
		[XmlElement(ElementName = "Neighborhood")]
		public string Neighborhood { get; set; }
		[XmlElement(ElementName = "State")]
		public string State { get; set; }
		[XmlElement(ElementName = "Zip")]
		public string Zip { get; set; }
		[XmlElement(ElementName = "Unit")]
		public string Unit { get; set; }
		[XmlElement(ElementName = "Latitude")]
		public string Latitude { get; set; }
		[XmlElement(ElementName = "Longitude")]
		public string Longitude { get; set; }
		[XmlElement(ElementName = "CreateDate")]
		public string CreateDate { get; set; }
		[XmlElement(ElementName = "UpdateDate")]
		public string UpdateDate { get; set; }
		[XmlElement(ElementName = "Beds")]
		public string Beds { get; set; }
		[XmlElement(ElementName = "BedInfo")]
		public string BedInfo { get; set; }
		[XmlElement(ElementName = "Room")]
		public string Room { get; set; }
		[XmlElement(ElementName = "Baths")]
		public string Baths { get; set; }
		[XmlElement(ElementName = "AvailableDate")]
		public string AvailableDate { get; set; }
		[XmlElement(ElementName = "Price")]
		public string Price { get; set; }
		[XmlElement(ElementName = "Fee")]
		public string Fee { get; set; }
		[XmlElement(ElementName = "Status")]
		public string Status { get; set; }
		[XmlElement(ElementName = "Laundry")]
		public string Laundry { get; set; }
		[XmlElement(ElementName = "IncludeElectricity")]
		public string IncludeElectricity { get; set; }
		[XmlElement(ElementName = "IncludeGas")]
		public string IncludeGas { get; set; }
		[XmlElement(ElementName = "IncludeHeat")]
		public string IncludeHeat { get; set; }
		[XmlElement(ElementName = "IncludeHotWater")]
		public string IncludeHotWater { get; set; }
		[XmlElement(ElementName = "ListingAgentID")]
		public string ListingAgentID { get; set; }
		[XmlElement(ElementName = "MlsOfficeName")]
		public string MlsOfficeName { get; set; }
		[XmlElement(ElementName = "UnitDescription")]
		public string UnitDescription { get; set; }
		[XmlElement(ElementName = "RentIncludes")]
		public RentIncludes RentIncludes { get; set; }
		[XmlElement(ElementName = "Photos")]
		public Photos Photos { get; set; }
		[XmlElement(ElementName = "Tags")]
		public Tags Tags { get; set; }
		[XmlElement(ElementName = "Features")]
		public Features Features { get; set; }
		[XmlElement(ElementName = "VirtualTours")]
		public VirtualTours VirtualTours { get; set; }
		[XmlElement(ElementName = "Pet")]
		public string Pet { get; set; }
		[XmlElement(ElementName = "SquareFootage")]
		public string SquareFootage { get; set; }
		[XmlElement(ElementName = "UnitLevel")]
		public string UnitLevel { get; set; }
		[XmlElement(ElementName = "Videos")]
		public Videos Videos { get; set; }
		[XmlElement(ElementName = "Parking")]
		public ParkingXml Parking { get; set; }
		[XmlElement(ElementName = "MoveInCosts")]
		public MoveInCostsXml MoveInCosts { get; set; }
	}
	[XmlRoot(ElementName = "RentIncludes")]
	public class RentIncludes
	{
		[XmlElement(ElementName = "RentInclude")]
		public List<string> RentInclude { get; set; }
	}

	[XmlRoot(ElementName = "Photos")]
	public class Photos
	{
		[XmlElement(ElementName = "Photo")]
		public List<string> Photo { get; set; }
	}

	[XmlRoot(ElementName = "Tags")]
	public class Tags
	{
		[XmlElement(ElementName = "Tag")]
		public List<string> Tag { get; set; }
	}

	[XmlRoot(ElementName = "Features")]
	public class Features
	{
		[XmlElement(ElementName = "Feature")]
		public List<string> Feature { get; set; }
	}

	[XmlRoot(ElementName = "VirtualTours")]
	public class VirtualTours
	{
		[XmlElement(ElementName = "VirtualTour")]
		public List<string> VirtualTour { get; set; }
	}

	[XmlRoot(ElementName = "MoveInCosts")]
	public class MoveInCostsXml
	{
		[XmlElement(ElementName = "IsFirstMonthRequired")]
		public bool IsFirstMonthRequired { get; set; }
		[XmlElement(ElementName = "IsLastMonthRequired")]
		public bool IsLastMonthRequired { get; set; }
		[XmlElement(ElementName = "PetDeposit")]
		public decimal PetDeposit { get; set; }
		[XmlElement(ElementName = "Fee")]
		public decimal Fee { get; set; }
		[XmlElement(ElementName = "KeyDeposit")]
		public decimal KeyDeposit { get; set; }
		[XmlElement(ElementName = "SecurityDeposit")]
		public decimal SecurityDeposit { get; set; }
		[XmlElement(ElementName = "ApplicationFee")]
		public decimal ApplicationFee { get; set; }
	}

	[XmlRoot(ElementName = "Videos")]
	public class Videos
	{
		[XmlElement(ElementName = "Video")]
		public List<string> Video { get; set; }
	}

	[XmlRoot(ElementName = "Parking")]
	public class ParkingXml
	{
		[XmlElement(ElementName = "ParkingAvailability")]
		public string ParkingAvailability { get; set; }
		[XmlElement(ElementName = "ParkingNumber")]
		public string ParkingNumber { get; set; }
		[XmlElement(ElementName = "ParkingType")]
		public string ParkingType { get; set; }
	}

	[XmlRoot(ElementName = "Listings")]
	public class Listings
	{
		[XmlElement(ElementName = "Listing")]
		public List<JGLListing> Listing { get; set; }
	}

	[XmlRoot(ElementName = "YGLResponse")]
	public class YGLResponse
	{
		[XmlElement(ElementName = "SubTotal")]
		public string SubTotal { get; set; }
		[XmlElement(ElementName = "Total")]
		public string Total { get; set; }
		[XmlElement(ElementName = "PageIndex")]
		public string PageIndex { get; set; }
		[XmlElement(ElementName = "PageCount")]
		public string PageCount { get; set; }
		[XmlElement(ElementName = "SortName")]
		public string SortName { get; set; }
		[XmlElement(ElementName = "SortDir")]
		public string SortDir { get; set; }
		[XmlElement(ElementName = "DetailLevel")]
		public string DetailLevel { get; set; }
		[XmlElement(ElementName = "Listings")]
		public Listings Listings { get; set; }
		[XmlAttribute(AttributeName = "responseCode")]
		public string ResponseCode { get; set; }
	}

}