using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace Realty.Controls
{
    public class ControlValue: FullAuditedEntity<long>, IMustHaveTenant
    {
        protected ControlValue()
        {
        }

        public ControlValue(string value)
        {
            Value = value;
        }

        [MaxLength(Constants.ValueMaxLength)]
        public string Value { get; set; }

        public int TenantId { get; set; }
    }
}
