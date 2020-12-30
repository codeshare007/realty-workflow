using System;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Handlers;
using Realty.Forms.Events;
using Realty.Forms.Jobs;
using Realty.Libraries;
using Realty.Signings;
using Realty.Transactions;

namespace Realty.Forms.Handlers
{
    public class FormCreatedEventHandler : 
        IAsyncEventHandler<FormCreatedEventData>,
        ITransientDependency
    {
        private readonly IBackgroundJobManager _jobManager;

        public FormCreatedEventHandler(IBackgroundJobManager jobManager) => _jobManager = jobManager;

        public async Task HandleEventAsync(FormCreatedEventData eventData)
        {
            await _jobManager.EnqueueAsync<FormInitializationBackgroundJob, 
                FormInitializationBackgroundJobArgs>(
                args: GetArgs(eventData.Parent, eventData.Entity),
                priority: BackgroundJobPriority.High);
        }

        private FormInitializationBackgroundJobArgs GetArgs(IHaveForms entity, Form form)
        {
            return entity switch
            {
                Library library => new FormInitializationBackgroundJobArgs(library, form),
                Transaction transaction => new FormInitializationBackgroundJobArgs(transaction, form),
                Signing signing => new FormInitializationBackgroundJobArgs(signing, form),
                _ => throw new ArgumentOutOfRangeException(nameof(entity))
            };
        }
    }
}
