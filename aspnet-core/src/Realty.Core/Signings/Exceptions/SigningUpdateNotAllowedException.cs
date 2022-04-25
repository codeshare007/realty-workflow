using System;

namespace Realty.Signings.Exceptions
{
    public class SigningUpdateNotAllowedException: Exception
    {
        private const string ErrorMessage = "Signing update is not allowed due to the status.";

        public SigningUpdateNotAllowedException() : base(ErrorMessage)
        {
        }
    }
}
