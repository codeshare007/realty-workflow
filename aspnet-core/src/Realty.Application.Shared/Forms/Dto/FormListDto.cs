using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Realty.Forms.Dto
{
    public class FormListDto: AuditedEntityDto<Guid>
    {
        [MaxLength(Constants.NameMaxLength)]
        public string Name { get; set; }

        public string ContentType { get; set; }
        
        public int DisplayOrder { get; set; }

        public FormStatus Status { get; set; }
        public bool SignedFileGenerated { get; set; }
    }
}
