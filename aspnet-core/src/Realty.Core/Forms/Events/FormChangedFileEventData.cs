using Abp.Events.Bus.Entities;
using Realty.Storage;
using System;
using Abp.Domain.Entities;

namespace Realty.Forms.Events
{
    public class FormChangedFileEventData : EntityEventData<File>
    {
        public IHaveForms Parent { get; }
        public IEntity<Guid> Form { get; }

        public FormChangedFileEventData(IHaveForms parent, IEntity<Guid> form, File file) : base(file)
        {
            Parent = parent;
            Form = form;
        }
    }
}
