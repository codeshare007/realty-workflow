using System.ComponentModel.DataAnnotations;

namespace Realty.Controls.Input
{
    public class ControlPositionInput
    {
        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public float Top { get; set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public float Left { get; set; }
    }
}
