using System;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Runtime.Security;
using Abp.Timing;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Realty.Authorization.Users;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Realty.Communications
{
    public class CommunicationMessageSender : RealtyDomainServiceBase, ICommunicationMessageSender
    {
        private readonly IRepository<CommunicationMessage, Guid> _communicationMessageRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly ICommunicationSmtpClientBuilder _smtpClientBuilder;

        public CommunicationMessageSender(
            IRepository<CommunicationMessage, Guid> communicationMessageRepository,
            IRepository<User, long> userRepository,
            ICommunicationSmtpClientBuilder smtpClientBuilder)
        {
            _communicationMessageRepository = communicationMessageRepository;
            _userRepository = userRepository;
            _smtpClientBuilder = smtpClientBuilder;
        }

        public async Task SendMessage(User sender, string contact, string subject, string contents)
        {
            var lastMessage = await _communicationMessageRepository.GetAll()
                .Include(x => x.ContactUser)
                .Where(x => x.UserId == sender.Id && x.Contact == contact && !x.IsLocal)
                .FirstOrDefaultAsync();

            var contactUser = lastMessage?.ContactUser;

            if (contactUser == null)
            {
                var normalizedContact = contact.ToUpperInvariant();
                contactUser = await _userRepository.FirstOrDefaultAsync(user => user.NormalizedEmailAddress == normalizedContact);
            }

            using var client = await GetClient(sender);
            var mail = new MailMessage(sender.EmailAddress, contact, subject, contents);
            var fromMailMessage = MimeMessage.CreateFromMailMessage(mail);
            await client.SendAsync(fromMailMessage);
            await client.DisconnectAsync(true);

            var message = new CommunicationMessage
            {
                User = sender,
                SenderUser = sender,
                SenderName = sender.FullName,
                Contact = contact,
                ContactUser = contactUser,
                ContactName = lastMessage?.ContactName ?? contactUser?.FullName,
                To = contact,
                ToUser = contactUser,
                ToName = lastMessage?.ContactName ?? contactUser?.FullName,
                Subject = subject,
                Message = contents,
                ReceivedOnUtc = Clock.Now,
                IsRead = true,
                IsLocal = true,
                ExternalId = fromMailMessage.MessageId
            };

            await _communicationMessageRepository.InsertAsync(message);
        }

        private async Task<SmtpClient> GetClient(User user)
        {
            var userIdentifier = user.ToUserIdentifier();
            var host = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Smtp.Host,
                userIdentifier
            );
            var port = await SettingManager.GetSettingValueForUserAsync<int>(
                CommunicationSettingNames.Smtp.Port,
                userIdentifier
            );
            var enableSsl = await SettingManager.GetSettingValueForUserAsync<bool>(
                CommunicationSettingNames.Smtp.EnableSsl,
                userIdentifier
            );

            var useDefaultCredentials = await SettingManager.GetSettingValueForUserAsync<bool>(
                CommunicationSettingNames.Smtp.UseDefaultCredentials,
                userIdentifier
            );
            if (useDefaultCredentials)
            {
                return await _smtpClientBuilder.BuildClient(host, port, enableSsl);
            }

            var domain = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Smtp.Domain,
                userIdentifier
            );
            var userName = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Smtp.UserName,
                userIdentifier
            );
            var encryptedPassword = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Smtp.Password,
                userIdentifier
            );
            var password = SimpleStringCipher.Instance.Decrypt(encryptedPassword);
            return await _smtpClientBuilder.BuildClient(host, port, enableSsl, domain, userName, password);
        }
    }
}
