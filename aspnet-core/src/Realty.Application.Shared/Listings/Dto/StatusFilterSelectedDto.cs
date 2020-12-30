using System;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class StatusFilterSelectedDto : EntityDto<Guid>
    {
        public Status Status { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }
}
