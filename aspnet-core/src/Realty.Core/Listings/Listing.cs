using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Extensions;
using Realty.Authorization.Users;
using Realty.Leads;
using Realty.Transactions;

namespace Realty.Listings
{
    public class Listing : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        private List<ListingDetail> _listingDetails = new List<ListingDetail>();
        private List<Transaction> _transactions = new List<Transaction>();
        private List<RecommendedListing> _recommendedListings = new List<RecommendedListing>();

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

        public List<string> Photo => _listingDetails.Where(s => s.Type == ListingDetailType.Photo).Select(s => s.Data).ToList();
        public List<string> VirtualTour => _listingDetails.Where(s => s.Type == ListingDetailType.Photos360).Select(s => s.Data).ToList();
        public List<string> Feature => _listingDetails.Where(s => s.Type == ListingDetailType.Feature).Select(s => s.Data).ToList();
        public List<string> Tag => _listingDetails.Where(s => s.Type == ListingDetailType.Tag).Select(s => s.Data).ToList();
        public List<string> Video => _listingDetails.Where(s => s.Type == ListingDetailType.Video).Select(s => s.Data).ToList();
        public virtual Parking Parking { get; set; }
        public virtual MoveInCosts MoveInCosts { get; set; }

        public int TenantId { get; set; }
        public long? AgentId { get; set; }
        public virtual User Agent { get; set; }
        public virtual ICollection<ListingDetail> ListingDetails => _listingDetails.AsReadOnly();
        public virtual IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();
        public virtual IReadOnlyCollection<RecommendedListing> RecommendedListings => _recommendedListings.AsReadOnly();
        
        public void AddListingDetail(ListingDetail item) {
            if (_listingDetails != null &&
                !_listingDetails.Any(d => d.Type == item.Type && d.Data == item.Data)) 
            {
                _listingDetails.Add(item);
            }
        }

        [NotMapped]
        public string FullAddress 
        {
            get 
            {
                var fullAddress = new StringBuilder();

                fullAddress.Append(StreetNumber + " " + StreetName);

                if (!string.IsNullOrEmpty(Unit))
                {
                    fullAddress.AppendFormat(", Unit #{0}", Unit);
                }

                if (!string.IsNullOrEmpty(City))
                {
                    fullAddress.AppendFormat(", {0}", City);
                }

                if (!string.IsNullOrEmpty(State))
                {
                    fullAddress.AppendFormat(", {0} {1}", State, Zip);
                }

                return fullAddress.ToString();
            }
        }
    }

    public class Parking
    {
        public string Availability { get; set; }
        public string ParkingNumber { get; set; }
        public string Type { get; set; }
        public string ParkingPrice { get; set; }

    }

    public class MoveInCosts
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

    public class ListingDetail : Entity<long>
    {
        public Guid ListingId { get; set; }
        public ListingDetailType Type { get; set; }
        public string Data { get; set; }
        public string Comment { get; set; }
    }
}
