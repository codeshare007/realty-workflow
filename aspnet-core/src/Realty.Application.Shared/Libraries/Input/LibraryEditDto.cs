using System;
using Abp.Application.Services.Dto;

namespace Realty.Libraries.Input
{
    public class LibraryEditDto: EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
