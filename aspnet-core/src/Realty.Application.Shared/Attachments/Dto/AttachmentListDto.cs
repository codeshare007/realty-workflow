using System;
using Abp.Application.Services.Dto;

namespace Realty.Attachments.Dto
{
    public class AttachmentListDto: AuditedEntityDto<Guid>
    {
        public string Name { get; set; }

        public string FileId { get; set; }
    }
}
