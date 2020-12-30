using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.RealTime;

namespace Realty.Documents
{
    public class NullDocumentNotifier : IDocumentNotifier
    {
        public async Task SendDocumentStatusChangedToClient(IReadOnlyList<IOnlineClient> clients, DocumentNotification notification)
        {
            await Task.CompletedTask;
        }
    }
}