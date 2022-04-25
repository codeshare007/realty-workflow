using System;
using System.Collections.Generic;
using Abp.Domain.Values;
using Microsoft.EntityFrameworkCore;

namespace Realty.Signings
{
    [Owned]
    public class ExpirationSettings: ValueObject
    {
        protected ExpirationSettings()
        {
        }

        public ExpirationSettings(DateTime? expirationDate)
        {
            ExpirationDate = expirationDate;
        }

        public DateTime? ExpirationDate { get; private set; }

        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] { ExpirationDate };
        }
    }
}
