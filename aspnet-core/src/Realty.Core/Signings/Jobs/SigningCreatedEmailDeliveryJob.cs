using System;
using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Realty.Signings.AccessRequests;

namespace Realty.Signings.Jobs
{
    public abstract class SigningCreatedEmailDeliveryJob<T>: AsyncBackgroundJob<T>, ITransientDependency
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly ISigningEmailService _signingEmailService;
        
        protected SigningCreatedEmailDeliveryJob(
            IRepository<Signing, Guid> signingRepository,
            ISigningEmailService signingEmailService)
        {
            _signingEmailService = signingEmailService;
            _signingRepository = signingRepository;
        }

        protected async Task SendRequestCreatedAsync(AccessRequest request)
        {
            Check.NotNull(request, nameof(request));

            using var uow = UnitOfWorkManager.Begin();
            using (UnitOfWorkManager.Current.SetTenantId(request.TenantId))
            {
                var signing = await _signingRepository.GetAsync(request.SigningId);
                await _signingEmailService.SendAccessRequestCreatedAsync(signing, request);
                await uow.CompleteAsync();
            }
        }
    }
}
