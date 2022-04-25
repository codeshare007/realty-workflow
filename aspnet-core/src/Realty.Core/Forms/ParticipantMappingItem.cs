using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Forms
{
    public class ParticipantMappingItem : FullAuditedEntity<Guid>, IMustHaveTenant
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        [MaxLength(Constants.NameMaxLength)]
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public int TenantId { get; set; }
    }
}
