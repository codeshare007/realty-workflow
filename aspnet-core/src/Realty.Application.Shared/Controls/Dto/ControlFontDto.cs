using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlFontDto
    {
        protected ControlFontDto()
        {
        }

        public ControlFontDto(int sizeInPx)
        {
            SizeInPx = sizeInPx;
        }

        [Range(Constants.Font.SizeMinValue, Constants.Font.SizeMaxValue)]
        public int SizeInPx { get; set; }
    }
}
