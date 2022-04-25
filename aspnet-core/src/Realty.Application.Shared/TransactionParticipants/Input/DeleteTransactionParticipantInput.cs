using System;

namespace Realty.TransactionParticipants.Input
{
    public class DeleteTransactionParticipantInput
    {
        public Guid ParticipantId { get; set; }

        public Guid TransactionId { get; set; }
    }
}
