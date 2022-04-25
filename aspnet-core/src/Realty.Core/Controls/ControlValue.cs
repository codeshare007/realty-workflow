using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;

namespace Realty.Controls
{
    public class ControlValue: FullAuditedEntity<long>, IMustHaveTenant
    {
        protected ControlValue()
        {
        }

        public ControlValue(string value, string ip, DateTime updateValueDate)
        {
            Value = value;
            IP = ip;
            UpdateValueDate = updateValueDate;
        }

        //todo: REVIEW
        //[MaxLength(Constants.ValueMaxLength)]
        public string Value { get; private set; }
        public DateTime UpdateValueDate { get; private set; }
        public string IP { get; private set; }

        public void SetValue(string value, string ip, DateTime updateValueDate)
        {
            Value = value;
            IP = ip;
            UpdateValueDate = updateValueDate;
        }

        public int TenantId { get; set; }
    }
}
