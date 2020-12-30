using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlValueDto
    {
        protected ControlValueDto()
        {
        }

        public ControlValueDto(string value)
        {
            Value = value;
        }

        [MaxLength(Constants.ValueMaxLength)]
        public string Value { get; set; }
    }
}
