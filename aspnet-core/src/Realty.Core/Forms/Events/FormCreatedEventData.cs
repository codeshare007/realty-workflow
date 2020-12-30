using Abp.Events.Bus.Entities;

namespace Realty.Forms.Events
{
    public class FormCreatedEventData: EntityEventData<Form>
    {
        public IHaveForms Parent { get; }

        public FormCreatedEventData(IHaveForms parent, Form form) : base(form)
        {
            Parent = parent;
        }
    }
}
