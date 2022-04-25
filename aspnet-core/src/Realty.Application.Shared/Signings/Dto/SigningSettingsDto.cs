using System;

namespace Realty.Signings.Dto
{
    public class SigningSettingsDto
    {
        public ReminderSettingsDto ReminderSettings { get; set; }

        public ExpirationSettingsDto ExpirationSettings { get; set; }
    }

    public class ReminderSettingsDto
    {
        public ReminderSettingsDto()
        {
        }

        public ReminderSettingsDto(ReminderFrequency frequency)
        {
            DispatchingFrequency = frequency;
        }

        public ReminderFrequency DispatchingFrequency { get; set; }
    }

    public class ExpirationSettingsDto
    {
        public ExpirationSettingsDto()
        {
        }

        public ExpirationSettingsDto(DateTime? expirationDate)
        {
            ExpirationDate = expirationDate;
        }

        public DateTime? ExpirationDate { get; set; }
    }
}
