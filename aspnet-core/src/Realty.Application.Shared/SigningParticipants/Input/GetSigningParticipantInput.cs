using System;

namespace Realty.SigningParticipants.Input
{
    public class GetSigningParticipantInput
    {
        public Guid ParticipantId { get; set; }

        public Guid SigningId { get; set; }
    }
}
