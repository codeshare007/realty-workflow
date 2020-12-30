using System;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;
using System.ComponentModel.DataAnnotations.Schema;

namespace Realty.Authorization.Delegation
{
    [Table("AppUserDelegations")]
    public class UserDelegation : FullAuditedEntity<long>, IMayHaveTenant
    {
        /// <summary>
        /// Id of user who delegates the account
        /// </summary>
        public long SourceUserId { get; set; }

        /// <summary>
        /// Id of user who is delegated for the <see cref="SourceUserId"/> account
        /// </summary>
        public long TargetUserId { get; set; }

        /// <summary>
        /// TenantId of delegation. Both users must be on same tenant.
        /// </summary>
        public int? TenantId { get; set; }

        /// <summary>
        /// Start time of delegation
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// End time of delegation
        /// </summary>
        public DateTime EndTime { get; set; }

        public bool IsCreatedByUser(long userId){
            return SourceUserId == userId;
        }

        public bool IsExpired(){
            return EndTime <= Clock.Now;
        }

        public bool IsValid(){
            return StartTime <= Clock.Now && !IsExpired();
        }
    }
}
