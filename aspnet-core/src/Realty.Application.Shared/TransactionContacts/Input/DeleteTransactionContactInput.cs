using System;

namespace Realty.TransactionContacts.Input
{
    public class DeleteTransactionContactInput
    {
        public Guid ContactId { get; set; }

        public Guid TransactionId { get; set; }
    }
}
