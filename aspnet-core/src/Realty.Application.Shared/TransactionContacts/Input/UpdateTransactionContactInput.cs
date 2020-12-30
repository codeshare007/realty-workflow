using Realty.Contacts.Dto;
using System;

namespace Realty.TransactionContacts.Input
{
    public class UpdateTransactionContactInput
    {
        public ContactDto Contact { get; set; }

        public Guid TransactionId { get; set; }
    }
}
