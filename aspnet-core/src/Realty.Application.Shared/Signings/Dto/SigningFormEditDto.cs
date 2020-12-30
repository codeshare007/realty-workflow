using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;

namespace Realty.Signings.Dto
{
    public class SigningFormEditDto: EntityDto<Guid>
    {
        protected SigningFormEditDto()
        {
        }

        public SigningFormEditDto(Guid signingId, string name, FormEditDto[] forms, string publicSigningLink)
        {
            Id = signingId;
            Name = name;
            Forms = forms;
            PublicSigningLink = publicSigningLink;
        }

        public string PublicSigningLink { get; set; }

        public string Name { get; set; }
        public FormEditDto[] Forms { get; set; }
    }
}
