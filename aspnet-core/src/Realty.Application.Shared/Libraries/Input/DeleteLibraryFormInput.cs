using System;
using Abp.Application.Services.Dto;

namespace Realty.Libraries.Input
{
    public class DeleteLibraryFormInput: EntityDto<Guid>
    {
        public EntityDto<Guid> Form { get; set; }
    }
}
