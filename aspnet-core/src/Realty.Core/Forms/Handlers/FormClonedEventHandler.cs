using System;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Handlers;
using Realty.Forms.Events;
using Realty.Forms.Jobs;
using Realty.Libraries;
using Realty.Signings;
using Realty.Storage;
using Realty.Transactions;

namespace Realty.Forms.Handlers
{
    public class FormClonedEventHandler : 
        IAsyncEventHandler<FormClonedEventData>,
        ITransientDependency
    {
        private readonly IBackgroundJobManager _jobManager;

        public FormClonedEventHandler(IBackgroundJobManager jobManager) => _jobManager = jobManager;

        public async Task HandleEventAsync(FormClonedEventData eventData)
        {
            await _jobManager.EnqueueAsync<FileReuploadBackgroundJob,
                FileReuploadBackgroundJobArgs>(
                args: GetArgs(eventData.Parent, eventData.Entity),
                priority: BackgroundJobPriority.Normal);
        }

        private FileReuploadBackgroundJobArgs GetArgs(IHaveForms entity, File file)
        {
            return entity switch
            {
                Library library => new FileReuploadBackgroundJobArgs(library, file),
                Transaction transaction => new FileReuploadBackgroundJobArgs(transaction, file),
                Signing signing => new FileReuploadBackgroundJobArgs(signing, file),
                _ => throw new ArgumentOutOfRangeException(nameof(entity))
            };
        }
    }
}
