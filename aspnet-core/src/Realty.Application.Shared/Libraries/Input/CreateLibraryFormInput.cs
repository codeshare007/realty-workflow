using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Input;

namespace Realty.Libraries.Input
{
    public class CreateLibraryFormInput: EntityDto<Guid>
    {
        public CreateFormInput Form { get; set; }
    }
}
