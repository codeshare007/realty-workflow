using System;
using Abp.Application.Services.Dto;
using Realty.Contacts.Input;

namespace Realty.SigningParticipants.Input
{
    public class CreateSigningParticipantInput
    {
        public CreateContactInput Participant { get; set; }

        public EntityDto<Guid> Signing { get; set; }
    }
}
