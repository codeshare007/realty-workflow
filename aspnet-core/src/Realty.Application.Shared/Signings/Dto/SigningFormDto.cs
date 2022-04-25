using Abp.Application.Services.Dto;
using Realty.Contacts.Dto;
using Realty.Forms.Dto;
using System;

namespace Realty.Signings.Dto
{
    public class SigningFormDto : EntityDto<Guid>
    {
        protected SigningFormDto()
        {
        }

        public SigningFormDto(Guid signingId, string name, FormEditDto[] forms, Guid? participantId, ContactInfoDto[] participants)
        {
            Id = signingId;
            Name = name;
            Forms = forms;
            ParticipantId = participantId;
            Participants = participants;
        }

        public string Name { get; set; }
        public Guid? ParticipantId { get; set; }
        public FormEditDto[] Forms { get; set; }
        public ContactInfoDto[] Participants { get; set; }
    }
}
