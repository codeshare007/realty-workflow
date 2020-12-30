using Realty.Forms.Input;
using System;
using Abp.Application.Services.Dto;

namespace Realty.Signings.Input
{
    public class GetSigningFormsInput : GetFormsInput, IEntityDto<Guid>
    {
        //Signing Id
        public Guid Id { get; set; }
    }
}
