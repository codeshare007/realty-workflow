using System;
using Abp.Application.Services.Dto;

namespace Realty.Forms.Input
{
    public class ParticipantMappingItemsInput : EntityDto<Guid>
    {
        public string Name { get; set; }

        public int DisplayOrder { get; set; }
    }
}
