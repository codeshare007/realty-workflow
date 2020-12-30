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

        public ControlPosition(int top, int left)
        {
            Top = top;
            Left = left;
        }

        [Range(Constants.Position.TopMinValue, Constants.Position.TopMaxValue)]
        public int Top { get; private set; }

        [Range(Constants.Position.LeftMinValue, Constants.Position.LeftMaxValue)]
        public int Left { get; private set; }
        
        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] {Top, Left};
        }
    }
}
