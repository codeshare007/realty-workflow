using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Handlers;
using Realty.Forms.Jobs;
using Realty.Signings.Events;
using Realty.Signings.Jobs;

namespace Realty.Signings.Handlers
{
    public class SigningStatusChangedEventHandlers: IAsyncEventHandler<SigningStatusChangedEventData>, ITransientDependency
    {
        private readonly IBackgroundJobManager _jobManager;
        
        public SigningStatusChangedEventHandlers(IBackgroundJobManager jobManager) =>
            _jobManager = jobManager;

        public async Task HandleEventAsync(SigningStatusChangedEventData eventData)
        {
            var signing = eventData.Entity;
            Check.NotNull(signing, nameof(signing));

            if (signing.Status != SigningStatus.Completed)
                return;

            var args = new CreateSignedPdfDocumentsBackgroundJobArgs(signing);

            await _jobManager.EnqueueAsync<CreateSignedPdfDocumentsBackgroundJob,
                CreateSignedPdfDocumentsBackgroundJobArgs>(args);
        }
    }
}
