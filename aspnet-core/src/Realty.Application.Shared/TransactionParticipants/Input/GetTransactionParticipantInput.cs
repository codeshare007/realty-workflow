using System;

namespace Realty.TransactionParticipants.Input
{
    public class GetTransactionParticipantInput
    {
        public Guid ParticipantId { get; set; }

        public Guid TransactionId { get; set; }
    }
}
