using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Input
{
    public class ControlSizeInput
    {
        [Range(Constants.Size.WidthMinValue, Constants.Size.WidthMaxValue)]
        public int Width { get; set; }

        [Range(Constants.Size.HeightMinValue, Constants.Size.HeightMaxValue)]
        public int Height { get; set; }
    }
}
