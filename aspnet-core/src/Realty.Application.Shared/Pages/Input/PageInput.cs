using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Realty.Controls.Input;

namespace Realty.Pages.Input
{
    public class PageInput: EntityDto<Guid>
    {
        public IList<ControlInput> Controls { get; set; }
    }
}
