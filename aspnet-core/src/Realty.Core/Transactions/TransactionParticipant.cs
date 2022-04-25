using System;
using System.ComponentModel.DataAnnotations.Schema;
using Realty.Contacts;

namespace Realty.Transactions
{
    public class TransactionParticipant : Contact
    {
        public Guid? TransactionId { get; set; }
        [ForeignKey("TransactionId ")]
        public virtual Transaction Transaction { get; set; }
    }
}
