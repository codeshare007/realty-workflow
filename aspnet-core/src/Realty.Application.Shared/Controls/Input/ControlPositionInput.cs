using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Input
{
    public class ControlPositionInput
    {
        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public int Top { get; set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public int Left { get; set; }
    }
}
