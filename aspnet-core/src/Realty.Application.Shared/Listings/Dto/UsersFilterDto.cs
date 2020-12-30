using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class UsersFilterDto : EntityDto<Guid>
    {
        public string Street { get; set; }
        public string StreetName { get; set; }
        public string Unit { get; set; }
        public string ListeningId { get; set; }
        public string ZipCode { get; set; }
        public decimal? Beds { get; set; }
        public bool? IsRoom { get; set; }
        public bool IsStudio { get; set; }
        public decimal? MinRent { get; set; }
        public decimal? MaxRent { get; set; }
        public decimal? MinBath { get; set; }
        public long UserId { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public ICollection<ParkingFeatureSelectedDto> Parking { get; set; }
        public ICollection<FeaturesFiltersSelectedDto> Features { get; set; }
        public ICollection<StatusFilterSelectedDto> Statuses { get; set; }
        public ICollection<MediaFilterSelectedDto> Media { get; set; }
        public ICollection<FeeFilterSelectedDto> Fees { get; set; }
        public ICollection<PetsFiltersSelectedDto> Pets { get; set; }
    }
}
