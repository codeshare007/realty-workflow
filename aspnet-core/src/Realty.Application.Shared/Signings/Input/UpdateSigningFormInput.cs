using Realty.Forms.Input;
using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class UpdateSigningFormInput: EntityDto<Guid>
    {
        public UpdateFormInput[] Forms { get; set; }
    }
}
