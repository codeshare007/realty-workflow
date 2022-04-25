using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlSizeDto
    {
        protected ControlSizeDto()
        {
        }

        public ControlSizeDto(float width, float height)
        {
            Width = width;
            Height = height;
        }

        [Range(Constants.Size.WidthMinValue, Constants.Size.WidthMaxValue)]
        public float Width { get; set; }

        [Range(Constants.Size.HeightMinValue, Constants.Size.HeightMaxValue)]
        public float Height { get; set; }
    }
}
