using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Realty.Attachments;
using Realty.Authorization.Users;
using Realty.Forms;
using Realty.Forms.Events;
using Realty.Leads;
using Realty.Listings;
using Realty.Signings;
using Realty.TransactionPaymentTrackers;

namespace Realty.Transactions
{
    public class Transaction : FullAuditedAggregateRoot<Guid>, IMustHaveTenant, IHaveForms, IHaveAttachments
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Form> _forms = new List<Form>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Attachment> _attachments = new List<Attachment>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<TransactionParticipant> _transactionParticipants = new List<TransactionParticipant>();

        public Transaction()
        {
        }

        public Transaction(string name)
        {
            Name = name;
        }

        public TransactionStatus Status { get; set; }
        
        public TransactionType Type { get; set; }
        
        public string Notes { get; set; }
        
        public long? CustomerId { get; set; }
        
        public long? AgentId { get; set; }
        
        public Guid? LeadId { get; set; }
        
        public Guid? ListingId { get; set; }

        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; set; }

        public int TenantId { get; set; }

        public virtual User Customer { get; set; }
        
        public virtual User Agent { get; set; }
        
        public virtual Lead Lead { get; set; }
        
        public virtual Listing Listing { get; set; }

        public virtual TransactionPaymentTracker PaymentTracker { get; set; }

        public virtual IReadOnlyCollection<Form> Forms => _forms.AsReadOnly();

        public virtual IReadOnlyCollection<Attachment> Attachments => _attachments.AsReadOnly();

        public virtual IReadOnlyCollection<TransactionParticipant> TransactionParticipants => _transactionParticipants.AsReadOnly();
        
        public void AddParticipant(TransactionParticipant participant)
        {
            _transactionParticipants.Add(participant);
        }
        public void RemoveParticipant(TransactionParticipant participant)
        {
            _transactionParticipants.Remove(participant);
        }

        public void Clone(Transaction transaction)
        {
            Check.NotNull(transaction, nameof(transaction));

            Status = transaction.Status;
            Type = transaction.Type;
            Notes = transaction.Notes;
            CustomerId = transaction.CustomerId;
            AgentId = transaction.AgentId;
            LeadId = transaction.LeadId;
            ListingId = transaction.ListingId;
            Name = transaction.Name;
        }

        public void Add(Form form)
        {
            Check.NotNull(form, nameof(form));

            var displayORder = _forms.Count > 0 ? (_forms.Select(s => s.DisplayOrder).Max() + 1) : 0;
            form.SetDisplayOrder(displayORder);
            _forms.Add(form);

            DomainEvents.Add(new FormCreatedEventData(this, form));
        }

        public Form CloneForm(Form form)
        {
            Check.NotNull(form, nameof(form));
            var clonedForm = form.Clone();

            var displayORder = _forms.Count > 0 ? (_forms.Select(s => s.DisplayOrder).Max() + 1) : 0;
            clonedForm.SetDisplayOrder(displayORder);
            _forms.Add(clonedForm);

            DomainEvents.Add(new FormClonedEventData(this, clonedForm.File));
            foreach (var page in clonedForm.Pages) 
            {
                DomainEvents.Add(new FormClonedEventData(this, page.File));
            }

            return clonedForm;
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

        public void AddAttachment(Attachment attachment)
        {
            _attachments.Add(attachment);
        }

        public void DeleteAttachment(Attachment attachment)
        {
            // ReSharper disable once InconsistentNaming
            var _attachment = _attachments.First(a => a.Id == attachment.Id);
            _attachments.Remove(_attachment);
        }
    }
}
