using System;
using Abp.Application.Services.Dto;

namespace Realty.Listings.Dto
{
    public class PetsFiltersSelectedDto : EntityDto<Guid>
    {
        public Pet Pet { get; set; }
        public bool Selected { get; set; }
        public Guid UserFilterId { get; set; }
    }

   
}
