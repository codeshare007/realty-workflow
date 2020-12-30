using System;
using System.Threading.Tasks;
using Abp;
using Abp.Domain.Repositories;

namespace Realty.Authorization.Delegation
{
    public class UserDelegationManager : RealtyServiceBase, IUserDelegationManager
    {
        private readonly IRepository<UserDelegation, long> _userDelegationRepository;

        public UserDelegationManager(IRepository<UserDelegation, long> userDelegationRepository)
        {
            _userDelegationRepository = userDelegationRepository;
        }

        public async Task<bool> HasActiveDelegationAsync(long sourceUserId, long targetUserId)
        {
            var activeUserDelegationExpression = new ActiveUserDelegationSpecification(sourceUserId, targetUserId)
                .ToExpression();

            var activeDelegation = await _userDelegationRepository.FirstOrDefaultAsync(activeUserDelegationExpression);

            return activeDelegation != null;
        }

        public bool HasActiveDelegation(long sourceUserId, long targetUserId)
        {
            var activeUserDelegationExpression = new ActiveUserDelegationSpecification(sourceUserId, targetUserId)
                    .ToExpression();

            var activeDelegation = _userDelegationRepository.FirstOrDefault(activeUserDelegationExpression);

            return activeDelegation != null;
        }

        public async Task RemoveDelegationAsync(long userDelegationId, UserIdentifier currentUser)
        {
            var delegation = await _userDelegationRepository.FirstOrDefaultAsync(e =>
                e.Id == userDelegationId && e.SourceUserId == currentUser.UserId
            );

            if (delegation == null)
            {
                throw new Exception("Only source user can delete a user delegation !");
            }

            await _userDelegationRepository.DeleteAsync(delegation);
        }

        public async Task<UserDelegation> GetAsync(long userDelegationId)
        {
            return await _userDelegationRepository.GetAsync(userDelegationId);
        }
    }
}