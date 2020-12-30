using System.Threading.Tasks;
using Abp;
using Abp.Domain.Services;

namespace Realty.Authorization.Delegation
{
    public interface IUserDelegationManager : IDomainService
    {
        Task<bool> HasActiveDelegationAsync(long sourceUserId, long targetUserId);

        bool HasActiveDelegation(long sourceUserId, long targetUserId);

        Task RemoveDelegationAsync(long userDelegationId, UserIdentifier currentUser);

        Task<UserDelegation> GetAsync(long userDelegationId);
    }
}
