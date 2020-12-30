using System.Threading.Tasks;
using Abp.Webhooks;

namespace Realty.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
