using System;
using Abp.Application.Services.Dto;

namespace Realty.Libraries.Input
{
    public class GetLibraryFormForEditInput: EntityDto<Guid>
    {
        public EntityDto<Guid> Form { get; set; }
    }
}
