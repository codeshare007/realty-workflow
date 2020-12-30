using System;
using Abp.Application.Services.Dto;
using Realty.Forms.Input;

namespace Realty.Libraries.Input
{
    public class GetLibraryFormsInput: GetFormsInput, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
}
