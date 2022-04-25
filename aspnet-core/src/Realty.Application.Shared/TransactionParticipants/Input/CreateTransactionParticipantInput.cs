using Realty.Contacts.Dto;
using Realty.TransactionParticipants.Dto;
using System;

namespace Realty.TransactionParticipants.Input
{
    public class CreateTransactionParticipantInput
    {
        public TransactionParticipantDto Participant { get; set; }

        public Guid TransactionId { get; set; }
    }
}
