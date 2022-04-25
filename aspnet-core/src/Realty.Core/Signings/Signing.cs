using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Abp;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;
using Realty.Attachments;
using Realty.Authorization.Users;
using Realty.Forms;
using Realty.Forms.Events;
using Realty.MultiTenancy;
using Realty.Signings.AccessRequests;
using Realty.Signings.Events;
using Realty.Signings.Exceptions;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Signings
{
    public class Signing: FullAuditedAggregateRoot<Guid>, IMustHaveTenant, IHaveForms, IHaveAttachments
    {
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Form> _forms = new List<Form>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<Attachment> _attachments = new List<Attachment>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<SigningRequest> _signingRequests = new List<SigningRequest>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<ViewRequest> _viewRequests = new List<ViewRequest>();
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private List<SigningParticipant> _participants = new List<SigningParticipant>();

        protected Signing()
        {
            Status = SigningStatus.Wizard;
        }

        public Signing(string name)
        {
            Name = name;
            Status = SigningStatus.Wizard;
        }

        [MaxLength(Constants.NameMaxLength), MinLength(Constants.NameMinLength)]
        public string Name { get; set; }
        public string Notes { get; set; }
        public int TenantId { get; set; }
        public long? AgentId { get; set; }
        public Guid? TransactionId { get; set; }
        public SigningStatus Status { get; private set; }

        public virtual File SignedFile { get; set; }
        public virtual User Agent { get; set; }

        public virtual Transaction Transaction { get; set; }

        public virtual Tenant Tenant { get; set; }

        public virtual ReminderSettings ReminderSettings { get; private set; }

        public virtual ExpirationSettings ExpirationSettings { get; private set; }
        
        public virtual IReadOnlyCollection<Attachment> Attachments => _attachments.AsReadOnly();

        public virtual IReadOnlyCollection<Form> Forms => _forms.OrderBy(f => f.DisplayOrder).ToList().AsReadOnly();

        public virtual IReadOnlyCollection<SigningRequest> SigningRequests => _signingRequests.AsReadOnly();

        public virtual IReadOnlyCollection<ViewRequest> ViewRequests => _viewRequests.AsReadOnly();

        public virtual IReadOnlyCollection<SigningParticipant> Participants => _participants.AsReadOnly();

        public void AddSignedFile(Storage.File file)
        {
            SignedFile = new File(new UploadFileResult()
            {
                ContentType = file.ContentType,
                Name = file.Name,
                Path = file.Path,
                Id = file.ExternalId,
            });
        }

        public void Add(Form form)
        {
            Forms.ToList();
            Check.NotNull(form, nameof(form));

            var displayORder = _forms.Count > 0 ? (_forms.Select(s => s.DisplayOrder).Max() + 1) : 0;
            form.SetDisplayOrder(displayORder);
            _forms.Add(form);

            DomainEvents.Add(new FormCreatedEventData(this, form));
        }

        public Form CloneForm(Form form, bool forNextSigning = false)
        {
            Forms.ToList(); 
            Check.NotNull(form, nameof(form));
            var clonedForm = form.Clone(forNextSigning);

            var displayORder = _forms.Count > 0 ? (_forms.Select(s => s.DisplayOrder).Max() + 1) : 0;
            clonedForm.SetDisplayOrder(displayORder);
            _forms.Add(clonedForm);

            if (forNextSigning)
            {
                DomainEvents.Add(new FormChangedFileEventData(this, clonedForm, clonedForm.File));
            }
            else 
            { 
                DomainEvents.Add(new FormClonedEventData(this, clonedForm.File));
                foreach (var page in clonedForm.Pages)
                {
                    DomainEvents.Add(new FormClonedEventData(this, page.File));
                }
            }

            return clonedForm;
        }

        public void RegeneratePageBackgrounds()
        {
            Forms.ToList(); 
            
            foreach (var form in Forms) 
            {
                DomainEvents.Add(new FormChangedFileEventData(this, form, form.File));
            }
        }



        public void Delete(Form form)
        {
            Forms.ToList(); 
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _forms.Remove(_form);
        }

        public void SetProcessing(Form form)
        {
            Forms.ToList(); 
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _form.SetStatus(FormStatus.Processing);

            DomainEvents.Add(new FormStatusChangedEventData(this, _form));
        }

        public void SetReady(Form form)
        {
            Forms.ToList(); 
            Check.NotNull(form, nameof(form));

            // ReSharper disable once InconsistentNaming
            var _form = _forms.First(f => f.Id == form.Id);
            _form.SetStatus(FormStatus.Ready);

            DomainEvents.Add(new FormStatusChangedEventData(this, _form));
        }

        public void SetExpirationSettings(ExpirationSettings settings)
        {
            ExpirationSettings = settings;
        }

        public void SetReminderSettings(ReminderSettings settings)
        {
            ReminderSettings = settings;
        }

        public void AddSigningRequest(SigningParticipant participant, SigningRequestSettings settings = null)
        {
            SigningRequests.ToList(); 
            Check.NotNull(participant, nameof(participant));

            if (!this.IsChangeAllowed())
                throw new SigningUpdateNotAllowedException();

            _signingRequests.Add(new SigningRequest(Id, participant, settings));
        }

        public void AddViewRequest(SigningParticipant participant)
        {
            ViewRequests.ToList();
            Check.NotNull(participant, nameof(participant));

            if (!this.IsChangeAllowed())
                throw new SigningUpdateNotAllowedException();

            _viewRequests.Add(new ViewRequest(Id, participant));
        }

        public void SetSigningRequestCompleted(SigningRequest request)
        {
            SigningRequests.ToList();
            Check.NotNull(request, nameof(request));

            // ReSharper disable once InconsistentNaming
            var _request = _signingRequests.First(r => r.Id == request.Id);
            _request.SetCompleted();

            // If all requests completed - complete signing
            CheckSigningForComplete();
        }

        public void SetSigningRequestRejected(SigningRequest request, string rejectComment)
        {
            SigningRequests.ToList();
            Check.NotNull(request, nameof(request));

            // ReSharper disable once InconsistentNaming
            var _request = _signingRequests.First(r => r.Id == request.Id);
            _request.SetRejected(rejectComment);
            this.Status = SigningStatus.Rejected;

            // If all requests completed - complete signing
            CheckSigningForComplete();
        }

        public void AddParticipant(SigningParticipant participant)
        {
            Participants.ToList();
            _participants.Add(participant);
        }

        public void RemoveParticipant(SigningParticipant transactionContact)
        {
            Participants.ToList();
            _participants.Remove(transactionContact);

            foreach (var form in Forms.ToList()) 
            {
                foreach (var page in form.Pages.ToList())
                {
                    foreach (var control in page.Controls.ToList())
                    {
                        if (control.ParticipantId == transactionContact.Id) 
                        {
                            control.SetParticipant(null);
                        }
                    }
                }
            }
        }

        public void Publish()
        {
            Status = SigningStatus.Pending;

            if (ReminderSettings != null)
            {
                ReminderSettings.SetNextDispatchTime(GetNextDispatchTime());
            }

            DomainEvents.Add(new SigningStatusChangedEventData(this));
        }

        public void Reject()
        {
            SigningRequests.ToList();
            if (SigningRequests.All(s => s.Status == SigningRequestStatus.Pending))
            {
                Status = SigningStatus.Rejected;
            }
        }

        private DateTime? GetNextDispatchTime()
        {
            return ReminderSettings.DispatchingFrequency == ReminderFrequency.Never
                ? (DateTime?) null
                : Clock.Now.AddHours(ReminderSettings.DispatchingFrequency.ToHours());
        }

        private void CheckSigningForComplete()
        {
            SigningRequests.ToList();
            if (SigningRequests.Any(r => r.Status != SigningRequestStatus.Completed)) return;
            Status = SigningStatus.Completed;
            DomainEvents.Add(new SigningStatusChangedEventData(this));
        }

        public void AddAttachment(Attachment attachment)
        {
            _attachments.Add(attachment);
        }
    }
}
