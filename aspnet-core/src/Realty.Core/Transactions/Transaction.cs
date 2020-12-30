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
using Realty.Leads;
using Realty.Listings;

namespace Realty.Transactions
{
    public class Transaction : FullAuditedAggregateRoot<Guid>, IMustHaveTenant, IHaveForms
    {
        // TODO: To be refactored
        // START 
        private List<TransactionContact> _transactionContacts = new List<TransactionContact>();
        //private List<TransactionForm> _transactionForms = new List<TransactionForm>();

        public TransactionStatus Status { get; set; }
        public TransactionType Type { get; set; }
        public string Notes { get; set; }
        public long? CustomerId { get; set; }
        public long? AgentId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? ListingId { get; set; }
        public virtual User Customer { get; set; }
        public virtual User Agent { get; set; }
        public virtual Lead Lead { get; set; }
        public virtual Listing Listing { get; set; }
        public virtual IReadOnlyCollection<TransactionContact> TransactionContacts => _transactionContacts.AsReadOnly();
        //public virtual IReadOnlyCollection<TransactionForm> TransactionForms => _transactionForms.AsReadOnly();

        public void AddContact(Contact contact)
        {
            this._transactionContacts.Add(new TransactionContact()
            {
                Contact = contact,
                TransactionId = this.Id
            });
        }
        public void RemoveContact(TransactionContact transactionContact)
        {
            this._transactionContacts.Remove(transactionContact);
        }
        // END

        private List<Form> _forms = new List<Form>();

        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; set; }

        public int TenantId { get; set; }

        public virtual IReadOnlyCollection<Form> Forms => _forms.AsReadOnly();

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
