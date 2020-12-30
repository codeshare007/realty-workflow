using System.Threading.Tasks;
using Realty.Authorization.Users;

namespace Realty.Communications
{
    public interface ICommunicationMessageSender
    {
        Task SendMessage(User sender, string contact, string subject, string contents);
    }
}