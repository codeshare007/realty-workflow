using System;

namespace Realty.Signings
{
    public static class ReminderFrequencyHelper
    {
        public static int ToHours(this ReminderFrequency frequency)
        {
            int value;

            switch (frequency)
            {
                    case ReminderFrequency.Never: value = 0;
                        break;
                    case ReminderFrequency.EachHour: value = 1;
                        break;
                    case ReminderFrequency.Each2Hours: value = 2; 
                        break;
                    case ReminderFrequency.Each4Hours: value = 4;
                        break;
                    case ReminderFrequency.Each6Hours: value = 6; 
                        break;
                    case ReminderFrequency.Each12Hours: value = 12;
                        break;
                    case ReminderFrequency.Each24Hours: value = 24;
                        break;
                    case ReminderFrequency.Each32Hours: value = 32;
                        break;
                    case ReminderFrequency.Each48Hours: value = 48;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(frequency));
            }

            return value;
        }
    }
}
