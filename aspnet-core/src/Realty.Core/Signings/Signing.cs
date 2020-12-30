using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Authorization.Users;
using Realty.Contacts;
using Realty.Forms;
using Realty.Forms.Events;
using Realty.MultiTenancy;
using Realty.Transactions;

namespace Realty.Signings
{
    public class Signing: FullAuditedAggregateRoot<Guid>, IMustHaveTenant, IHaveForms
    {
        // TODO: To be refactored
        // START 
        private List<SigningContact> _signingContacts = new List<SigningContact>();
        
        private List<Form> _forms = new List<Form>();

        protected Signing()
        {
        }

        public Signing(string name)
        {
            Name = name;
        }

        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; set; }
        public string Notes { get; set; }
        public int TenantId { get; set; }
        public long? AgentId { get; set; }
        public virtual User Agent { get; set; }
        public Guid? TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }
        public virtual Tenant Tenant { get; set; }

        public virtual IReadOnlyCollection<Form> Forms => _forms.AsReadOnly();
        public virtual IReadOnlyCollection<SigningContact> SigningContacts => _signingContacts.AsReadOnly();
        //public virtual IReadOnlyCollection<TransactionForm> TransactionForms => _transactionForms.AsReadOnly();

        public void AddContact(Contact contact)
        {
            this._signingContacts.Add(new SigningContact()
            {
                Contact = contact,
                SigningId = this.Id
            });
        }
        public void RemoveContact(SigningContact transactionContact)
        {
            this._signingContacts.Remove(transactionContact);
        }
        // END

        public void Add(Form form)
        {
            Check.NotNull(form, nameof(form));

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

            DomainEvents.Add(new FormStatusChangedEventData(this, _form));
        }

        public void SetReady(Form form)
        {
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _form.SetStatus(FormStatus.Ready);

            DomainEvents.Add(new FormStatusChangedEventData(this, _form));
        }
    }
}
