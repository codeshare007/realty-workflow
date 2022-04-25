using System;

namespace Realty.Signings.Jobs
{
    [Serializable]
    public class ViewRequestCreatedEmailDeliveryJobArgs
    {
        public Guid ViewRequestId { get; set; }
    }
}
