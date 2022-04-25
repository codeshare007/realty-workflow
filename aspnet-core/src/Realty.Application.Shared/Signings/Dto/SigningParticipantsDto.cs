using System.Collections.Generic;
using Realty.SigningParticipants.Dto;

namespace Realty.Signings.Dto
{
    public class SigningParticipantsDto
    {
        public IReadOnlyList<SigningSignerDto> Signers { get; set; }

        public IReadOnlyList<SigningViewerDto> Viewers { get; set; }
    }
}
