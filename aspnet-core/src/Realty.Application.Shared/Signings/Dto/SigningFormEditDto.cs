using System;
using Abp.Application.Services.Dto;
using Realty.Contacts.Dto;
using Realty.Forms.Dto;

namespace Realty.Signings.Dto
{
    public class SigningFormEditDto: EntityDto<Guid>
    {
        protected SigningFormEditDto()
        {
        }

        public SigningFormEditDto(Guid signingId, string name, FormEditDto[] forms, ContactListDto[] participants)
        {
            Id = signingId;
            Name = name;
            Forms = forms;
            Participants = participants;
        }

        public string Name { get; set; }

        public FormEditDto[] Forms { get; set; }

        public ContactListDto[] Participants { get; set; }
    }
}
