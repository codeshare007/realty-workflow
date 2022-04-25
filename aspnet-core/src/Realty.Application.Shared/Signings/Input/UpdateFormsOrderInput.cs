using Realty.Forms.Input;
using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class UpdateSigningFormsOrderInput : EntityDto<Guid>
    {
        //Signing Id
        public FormDisplayOrderInput[] Forms { get; set; }
    }
}
