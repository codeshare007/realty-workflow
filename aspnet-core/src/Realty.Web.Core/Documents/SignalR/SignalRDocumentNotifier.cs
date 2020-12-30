using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.RealTime;
using Castle.Core.Logging;
using Microsoft.AspNetCore.SignalR;
using Realty.Documents;

namespace Realty.Web.Documents.SignalR
{
    public class SignalRDocumentNotifier : IDocumentNotifier, ITransientDependency
    {
        /// <summary>
        /// Reference to the logger.
        /// </summary>
        public ILogger Logger { get; set; }

        private readonly IHubContext<DocumentHub> _documentHub;

        public SignalRDocumentNotifier(
            IHubContext<DocumentHub> documentHub)
        {
            _documentHub = documentHub;
            Logger = NullLogger.Instance;
        }

        public async Task SendDocumentStatusChangedToClient(IReadOnlyList<IOnlineClient> clients, DocumentNotification notification)
        {
            foreach (var client in clients)
            {
                var signalRClient = GetSignalRClientOrNull(client);
                if (signalRClient == null)
                {
                    continue;
                }

                await signalRClient.SendAsync("getDocumentStatusChanged", notification);
            }
        }

        private IClientProxy GetSignalRClientOrNull(IOnlineClient client)
        {
            var signalRClient = _documentHub.Clients.Client(client.ConnectionId);
            if (signalRClient == null)
            {
                Logger.Debug("Cannot get document creator " + client.UserId + " from SignalR hub!");
                return null;
            }

            return signalRClient;
        }
    }
}