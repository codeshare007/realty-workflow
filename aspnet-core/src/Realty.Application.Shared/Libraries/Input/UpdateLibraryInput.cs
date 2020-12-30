using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Realty.Libraries.Input
{
    public class UpdateLibraryInput: EntityDto<Guid>
    {
        [MaxLength(Constants.NameMaxLength)]
        [MinLength(Constants.NameMinLength)]
        public string Name { get; set; }
    }
}
