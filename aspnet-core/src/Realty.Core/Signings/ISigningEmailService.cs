using System.Threading.Tasks;
using Realty.Signings.AccessRequests;

namespace Realty.Signings
{
    public interface ISigningEmailService
    {
        Task SendAccessRequestCreatedAsync(Signing signing, AccessRequest request);
        Task SendAccessRequestReminderAsync(Signing signing, AccessRequest request);
        
        Task SendSigningCompletedAsync(Signing signing);
        Task SendSigningRejectedNotificationAsync(Signing signing, AccessRequest request);
    }
}
