using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Input
{
    public class ControlFontInput
    {
        [Range(Constants.Font.SizeMinValue, Constants.Font.SizeMaxValue)]
        public int SizeInPx { get; set; }
    }
}
