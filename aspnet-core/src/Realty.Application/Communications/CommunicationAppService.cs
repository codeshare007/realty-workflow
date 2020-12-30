using System;
using System.Collections.Immutable;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Runtime.Security;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Realty.Authorization;
using Realty.Communications.Dto;

namespace Realty.Communications
{
    [AbpAuthorize(AppPermissions.Pages_Communications)]
    public class CommunicationAppService : RealtyAppServiceBase, ICommunicationAppService
    {
        private readonly IRepository<CommunicationMessage, Guid> _communicationMessageRepository;
        private readonly ICommunicationMessageSender _messageSender;
        private readonly ICommunicationSmtpClientBuilder _smtpClientBuilder;
        private readonly ICommunicationImapClientBuilder _imapClientBuilder;

        public CommunicationAppService(
            IRepository<CommunicationMessage, Guid> communicationMessageRepository,
            ICommunicationMessageSender messageSender,
            ICommunicationSmtpClientBuilder smtpClientBuilder,
            ICommunicationImapClientBuilder imapClientBuilder)
        {
            _communicationMessageRepository = communicationMessageRepository;
            _messageSender = messageSender;
            _smtpClientBuilder = smtpClientBuilder;
            _imapClientBuilder = imapClientBuilder;
        }

        [DisableAuditing]
        public async Task<GetCommunicationTopicsOutput> GetCommunicationTopics()
        {
            if (!await AreSettingsInitialized())
            {
                return new GetCommunicationTopicsOutput(
                    isInitialized: false,
                    ImmutableList<CommunicationTopicListDto>.Empty
                );
            }

            var currentUserId = AbpSession.GetUserId();

            var result = await _communicationMessageRepository.GetAll()
                .Where(message => message.UserId == currentUserId)
                .GroupBy(
                    message => message.Contact,
                    message => message,
                    (contact, messages) => new
                    {
                        Contact = contact,
                        LastReceivedOnUtc = messages.Max(x => x.ReceivedOnUtc),
                        MessagesCount = messages.Count()
                    }
                )
                .ToListAsync();

            var dtos = ImmutableList.CreateBuilder<CommunicationTopicListDto>();

            foreach (var x in result)
            {
                var lastMessages = await _communicationMessageRepository.GetAll()
                    .Where(
                        message => message.UserId == currentUserId
                                   && message.Contact == x.Contact
                                   && message.ReceivedOnUtc >= x.LastReceivedOnUtc
                    )
                    .ToListAsync();

                var lastMessage = lastMessages.OrderByDescending(message => message.ReceivedOnUtc).First();

                dtos.Add(new CommunicationTopicListDto
                {
                    Contact = x.Contact,
                    UserId = lastMessage.ContactUserId,
                    Subject = lastMessage.Subject,
                    Message = lastMessage.Message,
                    IsRead = lastMessage.IsRead,
                    FullName = lastMessage.ContactName,
                    ReceivedOnUtc = lastMessage.ReceivedOnUtc,
                    MessagesCount = x.MessagesCount
                });
            }

            return new GetCommunicationTopicsOutput(
                isInitialized: true,
                dtos.OrderByDescending(x => x.ReceivedOnUtc).ToImmutableList()
            );
        }

        [DisableAuditing]
        public async Task<GetCommunicationTopicDetailsOutput> GetCommunicationTopicDetails(
            GetCommunicationTopicDetailsInput input)
        {
            var currentUserId = AbpSession.GetUserId();

            var items = await _communicationMessageRepository.GetAll()
                .Where(message => message.UserId == currentUserId && message.Contact == input.Contact)
                .OrderByDescending(message => message.ReceivedOnUtc)
                .ToListAsync();

            var anyItem = items.FirstOrDefault();

            foreach (var message in items.Where(x => !x.IsRead))
            {
                message.IsRead = true;
                await _communicationMessageRepository.UpdateAsync(message);
            }

            return new GetCommunicationTopicDetailsOutput
            {
                Contact = input.Contact,
                UserId = anyItem?.ContactUserId,
                FullName = anyItem?.ContactName,
                Items = items.Select(
                        message => new CommunicationItemDto
                        {
                            UserId = message.SenderUserId,
                            Sender = message.Sender,
                            SenderName = message.SenderName,
                            Receiver = message.To,
                            ReceiverName = message.ToName,
                            Subject = message.Subject,
                            Message = message.Message,
                            ReceivedOnUtc = message.ReceivedOnUtc
                        }
                    )
                    .ToImmutableList()
            };
        }

        [DisableAuditing]
        public async Task SendMessage(CommunicationSendMessageInput input)
        {
            var sender = await GetCurrentUserAsync();
            await _messageSender.SendMessage(sender, input.Contact, input.Subject, input.Message);
        }

        public async Task<CommunicationSettingsDto> GetSettings()
        {
            var userIdentifier = AbpSession.ToUserIdentifier();

            var imapPassword = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Imap.Password,
                userIdentifier
            );
            var smtpPassword = await SettingManager.GetSettingValueForUserAsync(
                CommunicationSettingNames.Smtp.Password,
                userIdentifier
            );

            return new CommunicationSettingsDto
            {
                Imap = new CommunicationImapSettingsDto
                {
                    IsEnabled = await SettingManager.GetSettingValueForUserAsync<bool>(
                        CommunicationSettingNames.Imap.IsEnabled,
                        userIdentifier
                    ),
                    Host = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Imap.Host,
                        userIdentifier
                    ),
                    Port = await SettingManager.GetSettingValueForUserAsync<int>(
                        CommunicationSettingNames.Imap.Port,
                        userIdentifier
                    ),
                    Domain = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Imap.Domain,
                        userIdentifier
                    ),
                    UserName = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Imap.UserName,
                        userIdentifier
                    ),
                    Password = SimpleStringCipher.Instance.Decrypt(imapPassword),
                    EnableSsl = await SettingManager.GetSettingValueForUserAsync<bool>(
                        CommunicationSettingNames.Imap.EnableSsl,
                        userIdentifier
                    )
                },
                Smtp = new CommunicationSmtpSettingsDto
                {
                    IsEnabled = await SettingManager.GetSettingValueForUserAsync<bool>(
                        CommunicationSettingNames.Smtp.IsEnabled,
                        userIdentifier
                    ),
                    Host = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Smtp.Host,
                        userIdentifier
                    ),
                    Port = await SettingManager.GetSettingValueForUserAsync<int>(
                        CommunicationSettingNames.Smtp.Port,
                        userIdentifier
                    ),
                    UserName = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Smtp.UserName,
                        userIdentifier
                    ),
                    Password = SimpleStringCipher.Instance.Decrypt(smtpPassword),
                    Domain = await SettingManager.GetSettingValueForUserAsync(
                        CommunicationSettingNames.Smtp.Domain,
                        userIdentifier
                    ),
                    EnableSsl = await SettingManager.GetSettingValueForUserAsync<bool>(
                        CommunicationSettingNames.Smtp.EnableSsl,
                        userIdentifier
                    ),
                    UseDefaultCredentials = await SettingManager.GetSettingValueForUserAsync<bool>(
                        CommunicationSettingNames.Smtp.UseDefaultCredentials,
                        userIdentifier
                    )
                }
            };
        }

        public async Task UpdateSettings(CommunicationSettingsDto input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();

            if (input.Imap.IsEnabled)
            {
                await TestImapSettings(input.Imap);
            }

            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.IsEnabled,
                input.Imap.IsEnabled.ToString().ToLowerInvariant()
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.Host,
                input.Imap.Host
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.Port,
                input.Imap.Port.ToString(CultureInfo.InvariantCulture)
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.Domain,
                input.Imap.Domain
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.UserName,
                input.Imap.UserName
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.Password,
                SimpleStringCipher.Instance.Encrypt(input.Imap.Password)
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Imap.EnableSsl,
                input.Imap.EnableSsl.ToString().ToLowerInvariant()
            );

            if (input.Smtp.IsEnabled)
            {
                await TestSmtpSettings(input.Smtp);
            }

            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.IsEnabled,
                input.Smtp.IsEnabled.ToString().ToLowerInvariant()
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.Host,
                input.Smtp.Host
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.Port,
                input.Smtp.Port.ToString(CultureInfo.InvariantCulture)
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.UserName,
                input.Smtp.UserName
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.Password,
                SimpleStringCipher.Instance.Encrypt(input.Smtp.Password)
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.Domain,
                input.Smtp.Domain
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.EnableSsl,
                input.Smtp.EnableSsl.ToString().ToLowerInvariant()
            );
            await SettingManager.ChangeSettingForUserAsync(
                userIdentifier,
                CommunicationSettingNames.Smtp.UseDefaultCredentials,
                input.Smtp.UseDefaultCredentials.ToString().ToLowerInvariant()
            );
        }

        private async Task TestImapSettings(CommunicationImapSettingsDto settings)
        {
            try
            {
                await _imapClientBuilder.BuildClient(
                    settings.Host,
                    settings.Port,
                    settings.EnableSsl,
                    settings.Domain,
                    settings.UserName,
                    settings.Password
                );
            }
            catch (Exception e)
            {
                throw new UserFriendlyException("Couldn't connect to IMAP server", e);
            }
        }

        private async Task TestSmtpSettings(CommunicationSmtpSettingsDto settings)
        {
            try
            {
                if (settings.UseDefaultCredentials)
                {
                    await _smtpClientBuilder.BuildClient(settings.Host, settings.Port, settings.EnableSsl);
                }
                else
                {
                    await _smtpClientBuilder.BuildClient(
                        settings.Host,
                        settings.Port,
                        settings.EnableSsl,
                        settings.Domain,
                        settings.UserName,
                        settings.Password
                    );
                }
            }
            catch (Exception e)
            {
                throw new UserFriendlyException("Couldn't connect to SMTP server", e);
            }
        }

        private async Task<bool> AreSettingsInitialized()
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            Task<bool> GetSetting(string key) => SettingManager.GetSettingValueForUserAsync<bool>(key, userIdentifier);

            return await GetSetting(CommunicationSettingNames.Imap.IsEnabled)
                   && await GetSetting(CommunicationSettingNames.Smtp.IsEnabled);
        }
    }
}
