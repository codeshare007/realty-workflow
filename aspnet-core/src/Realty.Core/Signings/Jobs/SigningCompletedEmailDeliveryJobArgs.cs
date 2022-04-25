using System;

namespace Realty.Signings.Jobs
{
    [Serializable]
    public class SigningCompletedEmailDeliveryJobArgs
    {
        public Guid SigningId { get; set; }
    }
}
