using System;

namespace Realty.Signings.Exceptions
{
    public class SigningCompletedException: Exception
    {
        private const string ErrorMessage = "Signing is already completed.";

        public SigningCompletedException() : base(ErrorMessage)
        {
        }
    }
}
