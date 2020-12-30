using System;
using Abp.Domain.Entities;
using Realty.Authorization.Users;

namespace Realty.Communications
{
    public class CommunicationMessage : Entity<Guid>, IMayHaveTenant, ISoftDelete
    {
        public int? TenantId { get; set; }

        public bool IsDeleted { get; set; }

        public long UserId { get; set; }

        public virtual User User { get; set; }

        public string Contact { get; set; }
        
        public string ContactName { get; set; }

        public long? ContactUserId { get; set; }

        public virtual User ContactUser { get; set; }

        public string Sender { get; set; }

        public string SenderName { get; set; }

        public virtual User SenderUser { get; set; }

        public long? SenderUserId { get; set; }

        public string To { get; set; }

        public string ToName { get; set; }

        public virtual User ToUser { get; set; }

        public long? ToUserId { get; set; }

        public string Subject { get; set; }

        public string Message { get; set; }

        public DateTime ReceivedOnUtc { get; set; }

        /// <summary>
        ///     true if message was composed in the application;
        ///     else - false.
        /// </summary>
        public bool IsLocal { get; set; }

        public bool IsRead { get; set; }

        public string ExternalId { get; set; }
    }
}
