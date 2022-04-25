using System;
using Abp.Application.Services.Dto;

namespace Realty.Forms.Dto
{
    public class ParticipantMappingItemDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; }

        public int DisplayOrder { get; set; }
    }
}
