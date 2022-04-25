using System;

namespace Realty.Signings.Exceptions
{
    public class SigningRequestCompletedException: Exception
    {
        private const string ErrorMessage = "Signing request is already completed.";

        public SigningRequestCompletedException() : base(ErrorMessage)
        {
        }
    }
}
