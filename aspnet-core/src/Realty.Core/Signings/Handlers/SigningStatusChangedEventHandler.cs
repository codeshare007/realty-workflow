using System;
using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Handlers;
using Realty.Signings.Events;
using Realty.Signings.Jobs;

namespace Realty.Signings.Handlers
{
    public class SigningStatusChangedEventHandler: IAsyncEventHandler<SigningStatusChangedEventData>, ITransientDependency
    {
        private readonly IBackgroundJobManager _jobManager;
        
        public SigningStatusChangedEventHandler(IBackgroundJobManager jobManager) =>
            _jobManager = jobManager;

        public async Task HandleEventAsync(SigningStatusChangedEventData eventData)
        {
            var signing = eventData.Entity;
            Check.NotNull(signing, nameof(signing));

            switch (signing.Status)
            {
                case SigningStatus.Pending:
                    await HandleSigningPublishedEventAsync(signing);
                    break;
                case SigningStatus.Completed:
                    await HandleSigningCompletedEventAsync(signing);
                    break;
            }
        }

        private async Task HandleSigningCompletedEventAsync(Signing signing)
        {
            var args = new SigningCompletedEmailDeliveryJobArgs
            {
                SigningId = signing.Id
            };

            await _jobManager.EnqueueAsync<SigningCompletedEmailDeliveryJob, 
                    SigningCompletedEmailDeliveryJobArgs>(args);
        }

        private async Task HandleSigningPublishedEventAsync(Signing signing)
        {
            static SigningRequestCreatedEmailDeliveryJobArgs GetSigningRequestJobArgs(Guid requestId)
                => new SigningRequestCreatedEmailDeliveryJobArgs {SigningRequestId = requestId};

            static ViewRequestCreatedEmailDeliveryJobArgs GetViewRequestJobArgs(Guid requestId)
                => new ViewRequestCreatedEmailDeliveryJobArgs {ViewRequestId = requestId};

            foreach (var signingRequest in signing.SigningRequests)
            {
                await _jobManager.EnqueueAsync<SigningRequestCreatedEmailDeliveryJob,
                    SigningRequestCreatedEmailDeliveryJobArgs>(GetSigningRequestJobArgs(signingRequest.Id));
            }

            foreach (var viewRequest in signing.ViewRequests)
            {
                await _jobManager.EnqueueAsync<ViewRequestCreatedEmailDeliveryJob,
                    ViewRequestCreatedEmailDeliveryJobArgs>(GetViewRequestJobArgs(viewRequest.Id));
            }
        }
    }
}
