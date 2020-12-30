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

        public ControlSize(int width, int height)
        {
            Width = width;
            Height = height;
        }

        [Range(Constants.Size.WidthMinValue, Constants.Size.WidthMaxValue)]
        public int Width { get; private set; }

        [Range(Constants.Size.HeightMinValue, Constants.Size.HeightMaxValue)]
        public int Height { get; private set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] { Width, Height };
        }
    }
}
