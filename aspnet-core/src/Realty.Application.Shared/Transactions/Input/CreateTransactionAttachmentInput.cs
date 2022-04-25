using System;
using Abp.Application.Services.Dto;
using Realty.Attachments.Input;

namespace Realty.Transactions.Input
{
    public class CreateTransactionAttachmentInput: EntityDto<Guid>
    {
        public CreateAttachmentInput Attachment { get; set; }
    }
}
