using System.Threading.Tasks;

namespace Realty.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}