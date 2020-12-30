using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Security;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Search;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MimeKit.Text;
using Realty.Authorization.Users;

namespace Realty.Communications
{
    public class CommunicationImapBackgroundJob
        : AsyncBackgroundJob<CommunicationImapBackgroundJobArgs>, ITransientDependency
    {
        private const int NewMessagesLimit = 100;

        private readonly ICommunicationImapClientBuilder _imapClientBuilder;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<CommunicationMessage, Guid> _communicationMessageRepository;

        public CommunicationImapBackgroundJob(
            ICommunicationImapClientBuilder imapClientBuilder,
            IRepository<User, long> userRepository,
            IRepository<CommunicationMessage, Guid> communicationMessageRepository)
        {
            _imapClientBuilder = imapClientBuilder;
            _userRepository = userRepository;
            _communicationMessageRepository = communicationMessageRepository;
        }

        [UnitOfWork(false)]
        protected override async Task ExecuteAsync(CommunicationImapBackgroundJobArgs args)
        {
            var user = await GetUser(args.UserId);
            if (user == null)
            {
                return;
            }

            using var _ = UnitOfWorkManager.Current.SetTenantId(user.TenantId);
            var userIdentifier = user.ToUserIdentifier();

            var users = await _userRepository.GetAllListAsync();

            var userName = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Imap.UserName,
                userIdentifier
            );

            using var client = await GetClient(userIdentifier, userName);

            await ProcessMessages(client, userName, user, users);
            await client.DisconnectAsync(true);
        }

        private async Task<IImapClient> GetClient(UserIdentifier userIdentifier, string userName)
        {
            var host = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Imap.Host,
                userIdentifier
            );

            var port = await SettingManager.GetSettingValueForUserAsync<int>(
                CommunicationSettingNames.Imap.Port,
                userIdentifier
            );

            var enableSsl = await SettingManager.GetSettingValueForUserAsync<bool>(
                CommunicationSettingNames.Imap.EnableSsl,
                userIdentifier
            );

            var domain = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Imap.Domain,
                userIdentifier
            );

            var encryptedPassword = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Imap.Password,
                userIdentifier
            );

            var password = SimpleStringCipher.Instance.Decrypt(encryptedPassword);

            return await _imapClientBuilder.BuildClient(host, port, enableSsl, domain, userName, password);
        }

        private async Task ProcessMessages(
            IImapClient client,
            string userName,
            User user,
            IReadOnlyCollection<User> users)
        {
            List<string> existingMessages;
            DateTime? lastMessageDate;

            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.SoftDelete))
            {
                existingMessages = await _communicationMessageRepository.GetAll()
                    .Where(x => !x.IsLocal)
                    .Select(message => message.ExternalId)
                    .ToListAsync();

                lastMessageDate = await _communicationMessageRepository.GetAll()
                    .Where(x => !x.IsLocal)
                    .OrderByDescending(message => message.ReceivedOnUtc)
                    .Select(message => message.ReceivedOnUtc)
                    .Cast<DateTime?>()
                    .FirstOrDefaultAsync();
            }

            await foreach (var message in await GetMessages(client, lastMessageDate))
            {
                await SaveMessage(message, userName, user, existingMessages, users);
            }
        }

        private static async Task<IAsyncEnumerable<MimeMessage>> GetMessages(
            IImapClient client,
            DateTime? lastMessageDate)
        {
            var inbox = client.Inbox;

            // The Inbox folder is always available on all IMAP servers...
            await inbox.OpenAsync(FolderAccess.ReadOnly);

            return lastMessageDate == null
                ? SearchMessages(client, inbox, SearchQuery.All, NewMessagesLimit)
                : SearchMessages(client, inbox, SearchQuery.DeliveredAfter(lastMessageDate.Value), int.MaxValue);
        }

        private static async IAsyncEnumerable<MimeMessage> SearchMessages(
            IImapClient client,
            IMailFolder inbox,
            SearchQuery query,
            int messagesLimit)
        {
            if (client.Capabilities.HasFlag(ImapCapabilities.Sort))
            {
                // client can sort natively
                var orderBy = new[] {OrderBy.ReverseArrival};
                var ids = await inbox.SortAsync(query, orderBy);
                for (var index = 0; index < ids.Count && index < messagesLimit; index++)
                {
                    var uid = ids[index];
                    yield return await inbox.GetMessageAsync(uid);
                }
            }
            else
            {
                // Load without sort - get all ids, sort by them
                var reversed = new UniqueIdSet(SortOrder.Descending);
                foreach (var uid in await inbox.SearchAsync(query))
                {
                    reversed.Add(uid);
                }

                for (var index = 0; index < reversed.Count && index < messagesLimit; index++)
                {
                    var uid = reversed[index];
                    yield return await inbox.GetMessageAsync(uid);
                }
            }
        }

        private async Task SaveMessage(
            MimeMessage message,
            string userName,
            User user,
            IEnumerable<string> existingMessages,
            IReadOnlyCollection<User> users)
        {
            User FindUser(string s)
            {
                var normalizedContact = s.ToUpperInvariant();
                return users.FirstOrDefault(x => x.NormalizedEmailAddress == normalizedContact);
            }

            const StringComparison ignoreCase = StringComparison.InvariantCultureIgnoreCase;

            var externalId = message.MessageId;
            if (existingMessages.Contains(externalId))
            {
                return;
            }

            var sender = message.From.OfType<MailboxAddress>().FirstOrDefault(x => x.Address != null);
            if (sender == null)
            {
                return;
            }

            var to = message.To.OfType<MailboxAddress>().FirstOrDefault(x => x.Address != null);
            if (to == null)
            {
                return;
            }

            var contact = !string.Equals(sender.Address, userName, ignoreCase) ? sender : to;

            var toUser = FindUser(to.Address);
            var senderUser = FindUser(sender.Address);
            var contactUser = FindUser(contact.Address);
            var communicationMessage = new CommunicationMessage
            {
                User = user,
                Contact = contact.Address,
                ContactName = contact.Name,
                ContactUser = contactUser,
                IsLocal = false,
                IsRead = false,
                Sender = sender.Address,
                SenderName = senderUser?.FullName ?? sender.Name,
                SenderUser = senderUser,
                To = to.Address,
                ToName = toUser?.FullName ?? to.Name,
                ToUser = toUser,
                Subject = message.Subject,
                Message = message.GetTextBody(TextFormat.Plain),
                ReceivedOnUtc = message.Date.UtcDateTime,
                ExternalId = externalId,
                TenantId = user.TenantId
            };

            await _communicationMessageRepository.InsertAsync(communicationMessage);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        private async Task<User> GetUser(long userId)
        {
            using var _ = UnitOfWorkManager.Current.DisableFilter(
                AbpDataFilters.MayHaveTenant,
                AbpDataFilters.MustHaveTenant
            );

            return await _userRepository.FirstOrDefaultAsync(userId);
        }
    }
}
