using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Net.Mail;
using Abp.Runtime.Security;
using Realty.MultiTenancy;

namespace Realty.Net.Emailing
{
    public abstract class EmailServiceBase: RealtyServiceBase
    {
        private readonly IEmailTemplateProvider _emailTemplateProvider;
        private readonly IEmailSender _emailSender;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly ICurrentUnitOfWorkProvider _unitOfWorkProvider;

        // used for styling action links on email messages.
        protected const string EmailButtonStyle =
            "padding-left: 30px; padding-right: 30px; padding-top: 12px; padding-bottom: 12px; color: #ffffff; background-color: #00bb77; font-size: 14pt; text-decoration: none;";
        protected const string EmailButtonColor = "#00bb77";

        protected EmailServiceBase(
            IEmailTemplateProvider emailTemplateProvider, 
            IEmailSender emailSender, 
            IRepository<Tenant> tenantRepository, 
            ICurrentUnitOfWorkProvider unitOfWorkProvider
            )
        {
            _emailTemplateProvider = emailTemplateProvider;
            _emailSender = emailSender;
            _tenantRepository = tenantRepository;
            _unitOfWorkProvider = unitOfWorkProvider;
        }

        /// <summary>
        /// Returns link with encrypted parameters
        /// </summary>
        /// <param name="link"></param>
        /// <param name="encrptedParameterName"></param>
        /// <returns></returns>
        protected string EncryptQueryParameters(string link, string encrptedParameterName = "c")
        {
            if (!link.Contains("?"))
            {
                return link;
            }

            var basePath = link.Substring(0, link.IndexOf('?'));
            var query = link.Substring(link.IndexOf('?')).TrimStart('?');

            return basePath + "?" + encrptedParameterName + "=" + HttpUtility.UrlEncode(SimpleStringCipher.Instance.Encrypt(query));
        }

        protected string GetTenancyNameOrNull(int? tenantId)
        {
            if (tenantId == null)
            {
                return null;
            }

            using (_unitOfWorkProvider.Current.SetTenantId(null))
            {
                return _tenantRepository.Get(tenantId.Value).TenancyName;
            }
        }

        protected StringBuilder GetTitleAndSubTitle(int? tenantId, string title, string subTitle)
        {
            var emailTemplate = new StringBuilder(_emailTemplateProvider.GetDefaultTemplate(tenantId));
            emailTemplate.Replace("{EMAIL_TITLE}", title);
            emailTemplate.Replace("{EMAIL_SUB_TITLE}", subTitle);

            return emailTemplate;
        }

        protected async Task ReplaceBodyAndSend(string emailAddress, string subject, StringBuilder emailTemplate, StringBuilder mailMessage)
        {
            await ReplaceBodyAndSend(emailAddress, null, null, subject, emailTemplate, mailMessage);
        }

        protected async Task ReplaceBodyAndSend(string emailAddress, string replyTo, string[] ccEmails, string subject, StringBuilder emailTemplate, StringBuilder mailMessage)
        {
            emailTemplate.Replace("{EMAIL_BODY}", mailMessage.ToString());
            
            var message =
                replyTo != null && replyTo.Length > 0
                ?
                    ccEmails != null && ccEmails.Length > 0
                    ? new MailMessage
                    {
                        To = { emailAddress },
                        Subject = subject,
                        CC = { string.Join(",", ccEmails) },
                        ReplyToList = { replyTo },
                        Body = emailTemplate.ToString(),
                        IsBodyHtml = true
                    }
                    : new MailMessage
                    {
                        To = { emailAddress },
                        ReplyToList = { replyTo },
                        Subject = subject,
                        Body = emailTemplate.ToString(),
                        IsBodyHtml = true
                    }
                : ccEmails != null && ccEmails.Length > 0
                    ? new MailMessage
                    {
                        To = { emailAddress },
                        Subject = subject,
                        CC = { string.Join(",", ccEmails) },
                        Body = emailTemplate.ToString(),
                        IsBodyHtml = true
                    }
                    : new MailMessage
                    {
                        To = { emailAddress },
                        Subject = subject,
                        Body = emailTemplate.ToString(),
                        IsBodyHtml = true
                    };

            await _emailSender.SendAsync(message);
        }
    }
}
