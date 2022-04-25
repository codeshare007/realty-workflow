using System;
using Abp.Domain.Entities;

namespace Realty.Signings.AccessRequests
{
    public abstract class AccessRequest: Entity<Guid>, IMustHaveTenant
    {
        protected AccessRequest()
        {
        }

        protected AccessRequest(Guid signingId, SigningParticipant participant)
        {
            Participant = participant;
            SigningId = signingId;
        }

        public Guid SigningId { get; private set; }

        public int TenantId { get; set; }
        public DateTime? LastViewDate { get; set; }

        public virtual SigningParticipant Participant { get; private set; }
    }
}
