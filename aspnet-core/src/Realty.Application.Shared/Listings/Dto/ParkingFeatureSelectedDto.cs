using System;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class ParkingFeatureSelectedDto : EntityDto<Guid>
    {
        public ParkingXml Parking { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }
}
