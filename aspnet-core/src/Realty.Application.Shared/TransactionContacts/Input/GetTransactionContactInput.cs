using System;

namespace Realty.TransactionContacts.Input
{
    public class GetTransactionContactInput
    {
        public Guid ContactId { get; set; }

        public Guid TransactionId { get; set; }
    }
}
