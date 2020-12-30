using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Authorization.Users;

namespace Realty.Listings
{
    public class UsersFilters : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        public int TenantId { get; set; }
        public string Street { get; set; }
        public string StreetName { get; set; }
        public string Unit { get; set; }
        public string ListeningId { get; set; }
        public string ZipCode { get; set; }
        public decimal? Beds  { get; set; }
        public bool? IsRoom { get; set; }
        public bool IsStudio { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent  { get; set; }
        public decimal? MinBath  { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public virtual ICollection<FiltersFeaturesSelected> Features { get; set; }
        public virtual ICollection<PetsFilterSelected> Pets { get; set; }

        public virtual ICollection<StatusFilterSelected> Statuses { get; set; }
        public virtual ICollection<MediaFilterSelected> Media { get; set; }
        public virtual ICollection<FeesFilterSelected> Fees { get; set; }
        public virtual ICollection<ParkingFilterSelected> Parking { get; set; }
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User {get; set; }
    }

   

  
}
