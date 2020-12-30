using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Input;

namespace Realty.Libraries.Input
{
    public class UpdateLibraryFormInput: EntityDto<Guid>
    {
        public UpdateFormInput Form { get; set; }
    }
}
