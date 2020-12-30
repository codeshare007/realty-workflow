using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Auditing;

namespace Realty.Communications.Dto
{
    public class CommunicationSmtpSettingsDto : IValidatableObject
    {
        public bool IsEnabled { get; set; }

        public string Host { get; set; }

        public int Port { get; set; }

        public string UserName { get; set; }

        [DisableAuditing]
        public string Password { get; set; }

        public string Domain { get; set; }

        public bool EnableSsl { get; set; }

        public bool UseDefaultCredentials { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (IsEnabled)
            {
                if (string.IsNullOrEmpty(Host))
                {
                    yield return new ValidationResult("Host is required", new[] {nameof(Host)});
                }

                if (!UseDefaultCredentials)
                {
                    if (string.IsNullOrEmpty(UserName))
                    {
                        yield return new ValidationResult("User Name is required", new[] {nameof(UserName)});
                    }

                    if (string.IsNullOrEmpty(Password))
                    {
                        yield return new ValidationResult("Password is required", new[] {nameof(Password)});
                    }
                }
            }
        }
    }
}
