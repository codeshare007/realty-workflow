using System;

namespace Realty.Signings.AccessRequests
{
    public class ViewRequest: AccessRequest
    {
        protected ViewRequest() : base()
        {
        }

        public ViewRequest(Guid signingId, SigningParticipant participant) :base(signingId, participant)
        {
        }
    }
}
