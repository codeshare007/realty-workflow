using System;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Net.Mail;
using Abp.Runtime.Security;
using Realty.MultiTenancy;
using Realty.Net.Emailing;
using Realty.Signings.AccessRequests;
using Realty.Url;

namespace Realty.Signings
{
    public class SigningEmailService: EmailServiceBase, ISigningEmailService, ITransientDependency
    {
        private readonly IWebUrlService _webUrlService;

        public SigningEmailService(
            IEmailTemplateProvider emailTemplateProvider,
            IEmailSender emailSender,
            IRepository<Tenant> tenantRepository,
            ICurrentUnitOfWorkProvider unitOfWorkProvider, 
            IWebUrlService webUrlService):base(emailTemplateProvider, emailSender, tenantRepository, unitOfWorkProvider)
        {
            _webUrlService = webUrlService;
        }

        public async Task SendAccessRequestCreatedAsync(Signing signing, AccessRequest request)
        {
            await SendSigningRequestReminderAsync(
                signing, 
                request, 
                L("EmailSigningRequestCreated_Subject", signing.Name));
        }

        public async Task SendAccessRequestReminderAsync(Signing signing, AccessRequest request)
        {
            await SendSigningRequestReminderAsync(
                signing, 
                request, 
                L("EmailSigningRequestReminder_Subject", signing.Name));
        }

        public async Task SendSigningCompletedAsync(Signing signing)
        {
            Check.NotNull(signing, nameof(signing));
            Check.NotNull(signing.Agent, nameof(signing.Agent));
            
            if (signing.Agent.EmailAddress.IsNullOrEmpty())
                throw new Exception("Email should be set in order to sent request created email.");

            var link = GetSigningUrl(signing);
            
            var emailTemplate = GetTitleAndSubTitle(signing.TenantId, L("EmailSigningCompleted_Title"), L("EmailSigningCompleted_SubTitle"));
            var mailMessage = new StringBuilder();

            mailMessage.AppendLine($"Hi {signing.Agent.FullName},<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine($"The signing <b>{signing.Name}</b> has been successfully reviewed and signed by all parties.<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<a style=\"" + EmailButtonStyle + "\" bg-color=\"" + EmailButtonColor + "\" href=\"" + link + "\">" + L("EmailSigningCompleted_ViewSigningBtn") + "</a>");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<span style=\"font-size: 9pt;\">" + L("EmailMessage_CopyTheLinkBelowToYourBrowser") + "</span><br />");
            mailMessage.AppendLine("<span style=\"font-size: 8pt;\">" + link + "</span>");
            mailMessage.AppendLine("<br />");

            await ReplaceBodyAndSend(
                emailAddress: signing.Agent.EmailAddress,
                subject: L("EmailSigningCompleted_Subject", signing.Name),
                emailTemplate: emailTemplate,
                mailMessage: mailMessage);
        }

        private async Task SendSigningRequestReminderAsync(Signing signing, AccessRequest request, string subject)
        {
            Check.NotNull(request, nameof(request));
            Check.NotNull(request.Participant, nameof(request.Participant));

            if (request.Participant.Email.IsNullOrEmpty())
                throw new Exception("Email should be set in order to sent request created email.");

            var link = GetSigningUrl(request);
            
            var emailTemplate = GetTitleAndSubTitle(request.TenantId, L("EmailSigningRequestCreated_Title"), L("EmailSigningRequestCreated_SubTitle"));
            var mailMessage = new StringBuilder();

            mailMessage.AppendLine($"Hi {request.Participant.FullName},<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine($"{signing.Agent.FullName} ({signing.Agent.EmailAddress}) is inviting you to participate as a document signing party.<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine($"<b>Signing:</b> {signing.Name}<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<a style=\"" + EmailButtonStyle + "\" bg-color=\"" + EmailButtonColor + "\" href=\"" + link + "\">" + GetButtonLabel(request) + "</a>");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<span style=\"font-size: 9pt;\">" + L("EmailMessage_CopyTheLinkBelowToYourBrowser") + "</span><br />");
            mailMessage.AppendLine("<span style=\"font-size: 8pt;\">" + link + "</span>");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("<br />");
            mailMessage.AppendLine("This invitation was sent to you by: <br />");
            mailMessage.AppendLine($"<b>{signing.Agent.FullName}</b><br />");
            mailMessage.AppendLine($"Phone: <b>{signing.Agent.PhoneNumber}</b><br />");
            mailMessage.AppendLine($"Email: <b>{signing.Agent.EmailAddress}</b><br />");

            await ReplaceBodyAndSend(
                emailAddress: request.Participant.Email,
                subject: subject,
                emailTemplate: emailTemplate,
                mailMessage: mailMessage);
        }

        public async Task SendSigningRejectedNotificationAsync(Signing signing, AccessRequest request)
        {
            Check.NotNull(request, nameof(request));
            Check.NotNull(request.Participant, nameof(request.Participant));

            if (request.Participant.Email.IsNullOrEmpty())
                throw new Exception("Email should be set in order to sent request created email.");

            var link = GetSigningUrl(signing);
            
            var emailTemplate = GetTitleAndSubTitle(request.TenantId, L("EmailSigningRejectNotification_Title"), L("EmailSigningRejectNotification_SubTitle"));
            var mailMessage = new StringBuilder();
            var signingLink = "";

            mailMessage.AppendLine($"{request.Participant.FullName} rejected the");
            mailMessage.AppendLine($" <a href='{link}' target='_blank'>signing</a>.");
            mailMessage.AppendLine($"<br />");

            if (request is SigningRequest)
            {
                var signingRequest = request as SigningRequest;

                if (signingRequest != null)
                {
                    var rejectComment = signingRequest.GetRejectComment();

                    if (!rejectComment.IsNullOrEmpty())
                    {
                        mailMessage.AppendLine($"<p>Reject Reason: <i>{HttpUtility.HtmlEncode(rejectComment)}</i></p>");
                    }
                }
            }
            

            await ReplaceBodyAndSend(
                emailAddress: signing.Agent.EmailAddress,
                subject: "Participant rejected the signing",
                emailTemplate: emailTemplate,
                mailMessage: mailMessage);
        }

        private string GetSigningUrl(AccessRequest request)
        {
            var query = $"id={request.Id}";
            var c = HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(query));

            var signingPath = request switch
            {
                SigningRequest _ => $"signing/{c}",
                ViewRequest _ => $"signing/{c}/view",
                _ => string.Empty
            };

            return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + signingPath;
        }

        private string GetSigningUrl(Signing signing)
        {
            return _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + $"app/admin/signings/{signing.Id}";
        }

        private string GetButtonLabel(AccessRequest request)
        {
            return request switch
            {
                SigningRequest r => L("EmailSigningRequest_StartSigningBtn"),
                ViewRequest r => L("EmailSigningCompleted_ViewSigningBtn"),
                _ => throw new ArgumentOutOfRangeException(nameof(request))
            };
        }
    }
}
