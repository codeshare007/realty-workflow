using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class FeaturesFiltersSelectedDto : EntityDto<Guid>
    {
        public string Feature { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }
}
