using System;

namespace Realty.Transactions.Input
{
    public class CreateTransactionInput
    {
        public string Name { get; set; }
        public TransactionStatus Status { get; set; }
        public TransactionType Type { get; set; }
        public string Notes { get; set; }

        public Guid? CustomerId { get; set; }
        public Guid? AgentId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? ListingId { get; set; }
    }
}
