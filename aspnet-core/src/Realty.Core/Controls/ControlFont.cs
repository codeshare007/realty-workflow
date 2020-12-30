using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Values;

namespace Realty.Controls
{
    public class ControlFont: ValueObject
    {
        protected ControlFont()
        {
        }

        public ControlFont(int sizeInPx)
        {
            SizeInPx = sizeInPx;
        }

        [Range(Constants.Font.SizeMinValue, Constants.Font.SizeMaxValue)]
        public int SizeInPx { get; private set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] { SizeInPx };
        }
    }
}
