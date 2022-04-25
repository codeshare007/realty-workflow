using System.Linq;
using Abp;
using Abp.Timing;
using Realty.Signings.AccessRequests;
using Realty.Signings.Exceptions;

namespace Realty.Signings
{
    public static class SigningExtensions
    {
        private static readonly SigningStatus[] ChangeAllowedStatuses = 
        {
            SigningStatus.Wizard
        };

        public static bool IsChangeAllowed(this Signing signing)
        {
            return ChangeAllowedStatuses.Contains(signing.Status);
        }

        public static bool IsRequestValid(this Signing signing, SigningRequest request, bool silently = true)
        {
            Check.NotNull(request, nameof(request));

            var isSigningCompleted = IsSigningCompleted(signing);
            if (!silently && isSigningCompleted)
                throw new SigningCompletedException();

            var isSigningRequestExpired = IsAccessRequestExpired(signing, request);
            if (!silently && isSigningRequestExpired)
                throw new AccessRequestExpiredException();

            var isSigningRequestCompleted = IsSigningRequestCompleted(signing, request);
            if (!silently && isSigningRequestCompleted)
                throw new SigningRequestCompletedException();

            return !isSigningCompleted &&
                   !isSigningRequestExpired &&
                   !isSigningRequestCompleted;
        }

        public static bool IsRequestValid(this Signing signing, ViewRequest request, bool silently = true)
        {
            Check.NotNull(request, nameof(request));

            var isSigningCompleted = IsSigningCompleted(signing);
            if (!silently && isSigningCompleted)
                throw new SigningCompletedException();

            var isViewRequestExpired = IsAccessRequestExpired(signing, request);
            if (!silently && isViewRequestExpired)
                throw new AccessRequestExpiredException();
            
            return !isSigningCompleted && !isViewRequestExpired;
        }

        private static bool IsSigningCompleted(Signing signing) =>
            signing.Status == SigningStatus.Completed;

        // ReSharper disable once UnusedParameter.Local
        private static bool IsAccessRequestExpired(Signing signing, AccessRequest request)
        {
            if (signing.ExpirationSettings?.ExpirationDate == null)
                return false;

            return signing.ExpirationSettings.ExpirationDate.Value < Clock.Now;
        }
        
        // ReSharper disable once UnusedParameter.Local
        private static bool IsSigningRequestCompleted(Signing signing, SigningRequest request) =>
            request.Status == SigningRequestStatus.Completed;
    }
}
