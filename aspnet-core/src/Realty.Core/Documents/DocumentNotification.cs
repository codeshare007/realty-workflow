using System;
using Abp.Notifications;

namespace Realty.Documents
{
    [Serializable]
    public class DocumentNotification
    {
        public int TenantId { get; set; }

        public long UserId { get; set; }

        public NotificationSeverity Severity { get; set; }

        public DateTime Time { get; set; }

        public string Name { get; set; }

        public string Text { get; set; }

        public string DocumentId { get; set; }
    }
}
