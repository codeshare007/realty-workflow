using System;
using Abp.Domain.Entities;

namespace Realty.Signings.AccessRequests
{
    public class SigningRequest: AccessRequest, IExtendableObject
    {
        private const string EmailSubjectFieldName = "emailSubject";
        private const string EmailMessageFieldName = "message";
        private const string RejectCommentFieldName = "rejectComment";

        protected SigningRequest() : base()
        {
        }

        public SigningRequest(Guid signingId, SigningParticipant participant, SigningRequestSettings settings = null): base(signingId, participant)
        {
            Status = SigningRequestStatus.Pending;

            if (settings != null)
                SetSettings(settings);
        }
        
        public SigningRequestStatus Status { get; private set; }

        public void SetCompleted()
        {
            Status = SigningRequestStatus.Completed;
        }
        public void SetRejected(string rejectComment)
        {
            Status = SigningRequestStatus.Rejected;
            SetRejectComment(rejectComment);
        }

        public string ExtensionData { get; set; }

        public SigningRequestSettings GetSettings()
        {
            return new SigningRequestSettings
            {
                EmailSubject = GetEmailSubject(),
                EmailBody = GetEmailBody()
            };
        }

        private void SetSettings(SigningRequestSettings settings)
        {
            SetEmailSubject(settings.EmailSubject);
            SetMessage(settings.EmailBody);
        }
        
        private void SetEmailSubject(string subject) => this.SetData(EmailSubjectFieldName, subject);
        
        private void SetMessage(string message) => this.SetData(EmailMessageFieldName, message);

        private string GetEmailSubject() => this.GetData<string>(EmailSubjectFieldName);

        private string GetEmailBody() => this.GetData<string>(EmailMessageFieldName);
        
        private void SetRejectComment(string rejectComment) => this.SetData(RejectCommentFieldName, rejectComment);

        public string GetRejectComment() => this.GetData<string>(RejectCommentFieldName);

    }
}
