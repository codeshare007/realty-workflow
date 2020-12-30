using System.Threading.Tasks;
using Realty.Authorization.Users;

namespace Realty.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
