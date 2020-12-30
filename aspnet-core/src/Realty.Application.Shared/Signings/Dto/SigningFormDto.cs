using Abp.Application.Services.Dto;
using Realty.Forms.Dto;
using System;

namespace Realty.Signings.Dto
{
    public class SigningFormDto : EntityDto<Guid>
    {
        protected SigningFormDto()
        {
        }

        public SigningFormDto(Guid signingId, string name, FormEditDto[] forms)
        {
            Id = signingId;
            Name = name;
            Forms = forms;
        }

        public string Name { get; set; }
        public FormEditDto[] Forms { get; set; }
    }
}
