using Abp.Events.Bus.Entities;
using Realty.Storage;
using System;

namespace Realty.Forms.Events
{
    public class FormClonedEventData : EntityEventData<File>
    {
        public IHaveForms Parent { get; }

        public FormClonedEventData(IHaveForms parent, File file) : base(file)
        {
            Parent = parent;
        }
    }
}
