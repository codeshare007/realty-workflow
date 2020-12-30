using System;
using Abp.Application.Services.Dto;

namespace Realty.Libraries.Input
{
    public class LibraryListDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
