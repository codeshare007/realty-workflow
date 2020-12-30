using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class ListingListResponse : PagedResultDto<Guid>
    {
        public List<ListingResposeDto> Listing { get; set; }
    }
}
