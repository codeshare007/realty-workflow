using System;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class MediaFilterSelectedDto : EntityDto<Guid>
    {
        public Media Media { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }
}
