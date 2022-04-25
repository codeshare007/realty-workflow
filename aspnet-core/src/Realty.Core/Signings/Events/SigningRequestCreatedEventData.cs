using Abp.Events.Bus.Entities;
using Realty.Signings.AccessRequests;

namespace Realty.Signings.Events
{
    public class SigningRequestCreatedEventData: EntityEventData<SigningRequest>
    {
        public SigningRequestCreatedEventData(SigningRequest entity) : base(entity)
        {
        }
    }
}
