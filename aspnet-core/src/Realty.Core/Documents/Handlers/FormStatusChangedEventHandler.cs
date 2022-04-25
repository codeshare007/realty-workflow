using System;
using System.Threading.Tasks;
using Abp;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Abp.Localization.Sources;
using Abp.RealTime;
using Realty.Forms;
using Realty.Forms.Events;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Documents.Handlers
{
    public class FormStatusChangedEventHandler: 
        IAsyncEventHandler<FormStatusChangedEventData>,
        ITransientDependency
    {
        private const string LocalizationSourceName = RealtyConsts.LocalizationSourceName;

        private readonly IOnlineClientManager<DocumentChannel> _onlineClientManager;
        private readonly IDocumentNotifier _communicator;
        private readonly DocumentNotificationFactory _notificationFactory;

        private readonly ILocalizationSource _localizationSource;

        public FormStatusChangedEventHandler(
            IDocumentNotifier communicator, 
            IOnlineClientManager<DocumentChannel> onlineClientManager, 
            DocumentNotificationFactory notificationFactory, 
            ILocalizationManager localizationManager)
        {
            _communicator = communicator;
            _onlineClientManager = onlineClientManager;
            _notificationFactory = notificationFactory;

            _localizationSource = localizationManager.GetSource(LocalizationSourceName);
        }

        public async Task HandleEventAsync(FormStatusChangedEventData eventData)
        {
            switch (eventData.Parent)
            {
                case Library library:
                    await HandleEventAsync(library, eventData.Entity);
                    break;
                case Transaction transaction:
                    HandleEventAsync(transaction, eventData.Entity);
                    break;
                case Signing signing:
                    HandleEventAsync(signing, eventData.Entity);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(eventData.Parent));
            }
        }
        
        private async Task HandleEventAsync(Library library, Form form)
        {
            var message = GetStatusChangeNotificationMessage(library, form);
            await DispatchNotification(library, form, message);
        }

        private async Task HandleEventAsync(Transaction transaction, Form form)
        {
            var message = GetStatusChangeNotificationMessage(transaction, form);
            await DispatchNotification(transaction, form, message);
        }

        private async Task HandleEventAsync(Signing signing, Form form)
        {
            var message = GetStatusChangeNotificationMessage(signing, form);
            await DispatchNotification(signing, form, message);
        }

        private async Task DispatchNotification<T>(T parent, Form form, string message) where T : class, IHaveForms, IEntity<Guid>
        {
            if (!form.CreatorUserId.HasValue) return;

            var userIdentifier = new UserIdentifier(form.TenantId, form.CreatorUserId.Value);
            var clients = _onlineClientManager.GetAllByUserId(userIdentifier);

            var notification = _notificationFactory.Create(parent, form, message);
            await _communicator.SendDocumentStatusChangedToClient(clients, notification);
        }

        private string GetStatusChangeNotificationMessage(IHaveForms parent, Form form)
        {
            if (parent is Library)
            {
                return form.Status switch
                {
                    FormStatus.Processing => L("Notification_LibraryForm_ProcessingStarted", form.Name),
                    FormStatus.Ready => L("Notification_LibraryForm_ProcessingCompleted", form.Name),
                    _ => throw new ArgumentOutOfRangeException()
                };
            }
            else if (parent is Transaction)
            {
                return form.Status switch
                {
                    FormStatus.Processing => L("Notification_TransactionForm_ProcessingStarted", form.Name),
                    FormStatus.Ready => L("Notification_TransactionForm_ProcessingCompleted", form.Name),
                    _ => throw new ArgumentOutOfRangeException()
                };
            }
            else if (parent is Signing)
            {
                return form.Status switch
                {
                    FormStatus.Processing => L("Notification_SigningForm_ProcessingStarted", form.Name),
                    FormStatus.Ready => L("Notification_SigningForm_ProcessingCompleted", form.Name),
                    _ => throw new ArgumentOutOfRangeException()
                };
            }

            throw new ArgumentOutOfRangeException(nameof(parent), parent, null);
        }

        private string L(string name) => _localizationSource.GetString(name);

        private string L(string name, params object[] args) => _localizationSource.GetString(name, args);
    }
}
