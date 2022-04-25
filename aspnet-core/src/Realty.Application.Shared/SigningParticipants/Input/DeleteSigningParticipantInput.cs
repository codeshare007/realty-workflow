using System;

namespace Realty.SigningParticipants.Input
{
    public class DeleteSigningParticipantInput
    {
        public Guid ParticipantId { get; set; }

        public Guid SigningId { get; set; }
    }
}
