using System;
using Abp.Application.Services.Dto;

namespace Realty.Transactions.Input
{
    public class DownloadTransactionAttachmentInput: EntityDto<Guid>
    {
        public EntityDto<Guid> Attachment { get; set; }
    }
}
