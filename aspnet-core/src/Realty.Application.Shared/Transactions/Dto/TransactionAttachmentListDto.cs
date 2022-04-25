using System;
using Abp.Application.Services.Dto;
using Realty.Attachments.Dto;

namespace Realty.Transactions.Dto
{
    public class TransactionAttachmentListDto: EntityDto<Guid>
    {
        public TransactionAttachmentListDto()
        {
        }

        public TransactionAttachmentListDto(Guid transactionId, AttachmentListDto attachment)
        {
            Id = transactionId;
            Attachment = attachment;
        }

        public AttachmentListDto Attachment { get; set; }
    }
}
