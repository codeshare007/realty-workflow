using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Dto
{
    public class ControlPositionDto
    {
        protected ControlPositionDto()
        {
        }

        public ControlPositionDto(int top, int left)
        {
            Top = top;
            Left = left;
        }

        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public int Top { get; set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public int Left { get; set; }
    }
}
