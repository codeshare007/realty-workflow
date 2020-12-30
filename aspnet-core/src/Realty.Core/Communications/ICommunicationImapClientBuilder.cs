using System.Threading.Tasks;
using MailKit.Net.Imap;

namespace Realty.Communications
{
    public interface ICommunicationImapClientBuilder
    {
        Task<IImapClient> BuildClient(
            string host,
            int port,
            bool useSsl,
            string domain,
            string userName,
            string password);
    }
}
