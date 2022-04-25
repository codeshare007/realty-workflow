using System;
using System.Collections.Generic;
using Abp.Domain.Values;
using Microsoft.EntityFrameworkCore;

namespace Realty.Signings
{
    [Owned]
    public class ReminderSettings: ValueObject
    {
        protected ReminderSettings()
        {
        }

        public ReminderSettings(ReminderFrequency dispatchingFrequency) =>
            DispatchingFrequency = dispatchingFrequency;

        public DateTime? NextDispatchTime { get; private set; }

        public ReminderFrequency DispatchingFrequency { get; private set; }

        public void SetNextDispatchTime(DateTime? dateTime)
        {
            NextDispatchTime = dateTime;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            return new object[] { NextDispatchTime, DispatchingFrequency };
        }
    }
}
