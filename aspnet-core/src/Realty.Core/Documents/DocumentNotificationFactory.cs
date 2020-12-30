using System;
using System.Diagnostics;
using Abp;
using Abp.Dependency;
using Abp.Notifications;
using Realty.Forms;
using Realty.Libraries;

namespace Realty.Documents
{
    public class DocumentNotificationFactory: ITransientDependency
    {
        // ReSharper disable once UnusedParameter.Global
        public DocumentNotification Create(Library library, Form form, string text)
        {
            static NotificationSeverity GetSeverity(FormStatus status)
            {
                return status switch
                {
                    FormStatus.New => NotificationSeverity.Info,
                    FormStatus.Processing => NotificationSeverity.Warn,
                    FormStatus.Ready => NotificationSeverity.Success,
                    _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
                };
            }

            static string GetName(FormStatus status)
            {
                return status switch
                {
                    FormStatus.New => Constants.Notifications.LibraryForms.FormCreated,
                    FormStatus.Processing => Constants.Notifications.LibraryForms.ProcessingStarted,
                    FormStatus.Ready => Constants.Notifications.LibraryForms.ProcessingCompleted,
                    _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
                };
            }

            Check.NotNull(form.CreatorUserId, nameof(form.CreatorUserId));
            Debug.Assert(form.CreatorUserId != null, "form.CreatorUserId != null");

            return new DocumentNotification
            {
                DocumentId = form.Id.ToString(),
                Name = GetName(form.Status),
                Severity = GetSeverity(form.Status),
                TenantId = form.TenantId,
                UserId = form.CreatorUserId.Value,
                Text = text,
                Time = form.LastModificationTime ?? form.CreationTime
            };
        }
    }
}
