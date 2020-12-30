using System;
using System.Linq.Expressions;
using Abp.Specifications;
using Abp.Timing;

namespace Realty.Authorization.Delegation
{
    public class ActiveUserDelegationSpecification : Specification<UserDelegation>
    {
        public long SourceUserId { get; }

        public long TargetUserId { get; }

        public ActiveUserDelegationSpecification(long sourceUserId, long targetUserId)
        {
            SourceUserId = sourceUserId;
            TargetUserId = targetUserId;
        }

        public override Expression<Func<UserDelegation, bool>> ToExpression()
        {
            var now = Clock.Now;
            return (e) => (e.SourceUserId == SourceUserId &&
                           e.TargetUserId == TargetUserId &&
                           e.StartTime <= now && e.EndTime >= now);
        }
    }
}