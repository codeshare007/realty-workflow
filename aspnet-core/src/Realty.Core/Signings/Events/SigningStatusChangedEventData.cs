using Abp.Events.Bus.Entities;

namespace Realty.Signings.Events
{
    public class SigningStatusChangedEventData: EntityEventData<Signing>
    {
        public SigningStatusChangedEventData(Signing entity) : base(entity)
        {
        }
    }
}
