using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Input;

namespace Realty.Signings.Input
{
    public class CreateSigningFormInput: EntityDto<Guid>
    {
        public CreateFormInput Form { get; set; }
    }
}
