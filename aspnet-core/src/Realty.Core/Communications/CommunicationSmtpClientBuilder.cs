using System.Net;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Extensions;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace Realty.Communications
{
    public class CommunicationSmtpClientBuilder : ICommunicationSmtpClientBuilder, ISingletonDependency
    {
        public async Task<SmtpClient> BuildClient(
            string host,
            int port,
            bool enableSsl,
            string domain,
            string userName,
            string password)
        {
            var client = await BuildClient(host, port, enableSsl);
            try
            {
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

        public async Task<SmtpClient> BuildClient(string host, int port, bool enableSsl)
        {
            var client = new SmtpClient();
            try
            {
                var socketOptions =
                    !enableSsl ? SecureSocketOptions.StartTlsWhenAvailable : SecureSocketOptions.SslOnConnect;
                await client.ConnectAsync(host, port, socketOptions);
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
