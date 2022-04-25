using System;

namespace Realty.Signings.Jobs
{
    [Serializable]
    public class SigningRequestCreatedEmailDeliveryJobArgs
    {
        public Guid SigningRequestId { get; set; }
    }
}
