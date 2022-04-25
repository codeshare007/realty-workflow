using Realty.TransactionParticipants.Dto;
using System;

namespace Realty.TransactionParticipants.Input
{
    public class UpdateTransactionParticipantInput
    {
        public TransactionParticipantDto Participant { get; set; }

        public Guid TransactionId { get; set; }
    }
}
