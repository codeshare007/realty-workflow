using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Dto;
using Realty.Libraries.Dto;

namespace Realty.Signings.Dto
{
    public class SigningFormListDto: EntityDto<Guid>, IHasFormDto<Guid>
    {
        protected SigningFormListDto()
        {
        }

        public SigningFormListDto(Guid signingId, FormListDto form)
        {
            Id = signingId;
            Form = form;
        }

        public FormListDto Form { get; set; }
    }
}
