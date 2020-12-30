using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.RealTime;

namespace Realty.Documents
{
    public interface IDocumentNotifier
    {
        Task SendDocumentStatusChangedToClient(IReadOnlyList<IOnlineClient> clients, DocumentNotification notification);
    }
}
