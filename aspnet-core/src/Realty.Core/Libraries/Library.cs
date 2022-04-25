using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Attachments;
using Realty.Forms;
using Realty.Forms.Events;

namespace Realty.Libraries
{
    public class Library: FullAuditedAggregateRoot<Guid>, IHaveForms, IMustHaveTenant, IHaveAttachments
    {
        private List<Form> _forms = new List<Form>();
        private List<Attachment> _attachments = new List<Attachment>();

        protected Library()
        {
        }

        public Library(string name)
        {
            Name = name;
        }

        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; private set; }

        public int TenantId { get; set; }

        public virtual IReadOnlyCollection<Form> Forms => _forms.AsReadOnly();

        public virtual IReadOnlyCollection<Attachment> Attachments => _attachments.AsReadOnly();

        public void Add(Form form)
        {
            Check.NotNull(form, nameof(form));

            var displayORder = _forms.Count > 0 ? (_forms.Select(s => s.DisplayOrder).Max() + 1) : 0;
            form.SetDisplayOrder(displayORder);
            _forms.Add(form);

            DomainEvents.Add(new FormCreatedEventData(this, form));
        }

        public void Delete(Form form)
        {
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _forms.Remove(_form);
        }

        public void SetProcessing(Form form)
        {
            Check.NotNull(form, nameof(form));
            
            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _form.SetStatus(FormStatus.Processing);

            DomainEvents.Add(new FormStatusChangedEventData(this, form));
        }

        public void SetReady(Form form)
        {
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _form.SetStatus(FormStatus.Ready);

            DomainEvents.Add(new FormStatusChangedEventData(this, form));
        }
    }
}
