using System;
using Abp.Application.Services.Dto;

namespace Realty.Forms.Input
{
    public class UpdateParticipantMappingItemsInput : EntityDto<Guid>
    {
        public Guid FormId { get; set; }
        public ParticipantMappingItemsInput[] Items { get; set; }
    }
}
