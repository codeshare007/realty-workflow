using System.Threading.Tasks;
using MailKit.Net.Smtp;

namespace Realty.Communications
{
    public interface ICommunicationSmtpClientBuilder
    {
        Task<SmtpClient> BuildClient(string host, int port, bool enableSsl);

        Task<SmtpClient> BuildClient(
            string host,
            int port,
            bool enableSsl,
            string domain,
            string userName,
            string password);
    }
}
