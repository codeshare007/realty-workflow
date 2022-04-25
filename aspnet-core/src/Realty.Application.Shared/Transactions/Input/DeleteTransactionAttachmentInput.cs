using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Input
{
    public class DeleteTransactionAttachmentInput: EntityDto<Guid>
    {
        public EntityDto<Guid> Attachment { get; set; }
    }
}
