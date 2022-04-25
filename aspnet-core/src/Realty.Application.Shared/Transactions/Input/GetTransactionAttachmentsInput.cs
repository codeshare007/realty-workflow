using System;
using Realty.Attachments.Input;

namespace Realty.Transactions.Input
{
    public class GetTransactionAttachmentsInput: GetAttachmentsInput
    {
        public Guid Id { get; set; }
    }
}
