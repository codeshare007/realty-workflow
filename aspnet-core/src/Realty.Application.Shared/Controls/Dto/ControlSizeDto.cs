using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlSizeDto
    {
        protected ControlSizeDto()
        {
        }

        public ControlSizeDto(int width, int height)
        {
            Width = width;
            Height = height;
        }

        [Range(Constants.Size.WidthMinValue, Constants.Size.WidthMaxValue)]
        public int Width { get; set; }

        [Range(Constants.Size.HeightMinValue, Constants.Size.HeightMaxValue)]
        public int Height { get; set; }
    }
}
