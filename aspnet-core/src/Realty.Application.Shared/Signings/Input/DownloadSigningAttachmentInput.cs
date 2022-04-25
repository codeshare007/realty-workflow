using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class DownloadSigningAttachmentInput : EntityDto<Guid>
    {
        public EntityDto<Guid> Attachment { get; set; }
    }
}
