using System;
using System.Collections.Generic;
using Abp.Domain.Entities;
using Realty.Controls.Dto;

namespace Realty.Pages.Dto
{
    public class PageEditDto: Entity<Guid>
    {
        public int Number { get; set; }

        public Guid FileId { get; set; }

        public IList<ControlEditDto> Controls { get; set; }
    }
}
