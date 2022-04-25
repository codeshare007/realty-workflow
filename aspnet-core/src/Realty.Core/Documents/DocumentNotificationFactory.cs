using System;
using System.Diagnostics;
using Abp;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Notifications;
using Realty.Forms;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Documents
{
    public class DocumentNotificationFactory: ITransientDependency
    {
        // ReSharper disable once UnusedParameter.Global
        public DocumentNotification Create<T>(T parent, Form form, string text) where T: class, IHaveForms, IEntity<Guid>
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

            static string GetName(IHaveForms parent, FormStatus status)
            {
                if (parent is Library)
                {
                    return status switch
                    {
                        FormStatus.New => Constants.Notifications.LibraryForms.FormCreated,
                        FormStatus.Processing => Constants.Notifications.LibraryForms.ProcessingStarted,
                        FormStatus.Ready => Constants.Notifications.LibraryForms.ProcessingCompleted,
                        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
                    };
                }
                else if (parent is Transaction)
                {
                    return status switch
                    {
                        FormStatus.New => Constants.Notifications.TransactionForms.FormCreated,
                        FormStatus.Processing => Constants.Notifications.TransactionForms.ProcessingStarted,
                        FormStatus.Ready => Constants.Notifications.TransactionForms.ProcessingCompleted,
                        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
                    };
                }
                else if (parent is Signing)
                {
                    return status switch
                    {
                        FormStatus.New => Constants.Notifications.SigningForms.FormCreated,
                        FormStatus.Processing => Constants.Notifications.SigningForms.ProcessingStarted,
                        FormStatus.Ready => Constants.Notifications.SigningForms.ProcessingCompleted,
                        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
                    };
                }

                throw new ArgumentOutOfRangeException(nameof(parent), parent, null);
            }

            Check.NotNull(form.CreatorUserId, nameof(form.CreatorUserId));
            Debug.Assert(form.CreatorUserId != null, "form.CreatorUserId != null");

            return new DocumentNotification
            {
                ParentId = parent.Id,
                DocumentId = form.Id.ToString(),
                Name = GetName(parent, form.Status),
                Severity = GetSeverity(form.Status),
                TenantId = form.TenantId,
                UserId = form.CreatorUserId.Value,
                Text = text,
                Time = form.LastModificationTime ?? form.CreationTime
            };
        }
    }
}
