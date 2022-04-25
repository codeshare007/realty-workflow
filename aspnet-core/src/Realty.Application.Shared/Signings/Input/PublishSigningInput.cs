using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class PublishSigningInput : EntityDto<Guid>
    {
        public List<SigningParticipantCustomDataInput> ParticipantCustomData { get; set; }
    }
}
