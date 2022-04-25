using Abp.Events.Bus.Entities;
using System;

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
