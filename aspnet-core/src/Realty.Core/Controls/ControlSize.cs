using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Values;

namespace Realty.Controls
{
    public class ControlSize: ValueObject
    {
        protected ControlSize()
        {
        }

        public ControlSize(float width, float height)
        {
            Width = width;
            Height = height;
        }

        [Range(Constants.Size.WidthMinValue, Constants.Size.WidthMaxValue)]
        public float Width { get; private set; }

        [Range(Constants.Size.HeightMinValue, Constants.Size.HeightMaxValue)]
        public float Height { get; private set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] { Width, Height };
        }
    }
}
