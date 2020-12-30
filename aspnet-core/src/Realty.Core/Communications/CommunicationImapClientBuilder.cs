using System.Net;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Extensions;
using MailKit.Net.Imap;

namespace Realty.Communications
{
    public class CommunicationImapClientBuilder : ICommunicationImapClientBuilder, ISingletonDependency
    {
        public async Task<IImapClient> BuildClient(
            string host,
            int port,
            bool useSsl,
            string domain,
            string userName,
            string password)
        {
            var client = new ImapClient();
            try
            {
                await client.ConnectAsync(host, port, useSsl);

                var credentials = !domain.IsNullOrEmpty()
                    ? new NetworkCredential(userName, password, domain)
                    : new NetworkCredential(userName, password);

                await client.AuthenticateAsync(credentials);
                return client;
            }
            catch
            {
                client.Dispose();
                throw;
            }
        }
    }
}
