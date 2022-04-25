using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlPositionDto
    {
        protected ControlPositionDto()
        {
        }

        public ControlPositionDto(float top, float left)
        {
            Top = top;
            Left = left;
        }

        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public float Top { get; set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public float Left { get; set; }
    }
}
