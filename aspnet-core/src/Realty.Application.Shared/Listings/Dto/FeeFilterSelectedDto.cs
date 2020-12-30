using System;
using Abp.Application.Services.Dto;
using Realty.Listings;

namespace Realty.Listings.Dto
{
    public class FeeFilterSelectedDto : EntityDto<Guid>
    {
        public Fee Fee { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }
}
