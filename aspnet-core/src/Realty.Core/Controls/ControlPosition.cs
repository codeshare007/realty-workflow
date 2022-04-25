using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Values;

namespace Realty.Controls
{
    public class ControlPosition: ValueObject
    {
        protected ControlPosition()
        {
        }

        public ControlPosition(float top, float left)
        {
            Top = top;
            Left = left;
        }

        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public float Top { get; private set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public float Left { get; private set; }
        
        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] {Top, Left};
        }
    }
}
