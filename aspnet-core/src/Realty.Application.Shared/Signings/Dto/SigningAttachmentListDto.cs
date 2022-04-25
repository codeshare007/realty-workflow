using System;
using Abp.Application.Services.Dto;
using Realty.Attachments.Dto;

namespace Realty.Signings.Dto
{
    public class SigningAttachmentListDto: EntityDto<Guid>
    {
        public SigningAttachmentListDto()
        {
        }

        public SigningAttachmentListDto(Guid transactionId, string createdBy, AttachmentListDto attachment)
        {
            Id = transactionId;
            CreatedBy = createdBy;
            Attachment = attachment;
        }

        public AttachmentListDto Attachment { get; set; }
        public string CreatedBy { get; set; }
    }
}
