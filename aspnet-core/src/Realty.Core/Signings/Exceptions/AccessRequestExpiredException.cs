using System;

namespace Realty.Signings.Exceptions
{
    public class AccessRequestExpiredException: Exception
    {
        private const string ErrorMessage = "Access request token is expired.";
        public AccessRequestExpiredException() : base(ErrorMessage)
        {
        }
    }
}
