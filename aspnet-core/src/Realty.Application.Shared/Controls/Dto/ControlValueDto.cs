using System;
using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlValueDto
    {
        protected ControlValueDto()
        {
        }

        public ControlValueDto(string value, DateTime updateValueDate)
        {
            Value = value;
            UpdateValueDate = updateValueDate;
        }

        [MaxLength(Constants.ValueMaxLength)]
        public string Value { get; set; }

        public DateTime UpdateValueDate { get; private set; }
    }
}
