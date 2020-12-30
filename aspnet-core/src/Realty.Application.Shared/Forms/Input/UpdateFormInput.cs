using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Realty.Pages.Input;

namespace Realty.Forms.Input
{
    public class UpdateFormInput: EntityDto<Guid>
    {
        public IList<PageInput> Pages { get; set; }
    }
}
