using System;
using System.Threading.Tasks;
using Abp;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;

namespace Realty.Signings.Jobs
{
    public class SigningCompletedEmailDeliveryJob: AsyncBackgroundJob<SigningCompletedEmailDeliveryJobArgs>, ITransientDependency
    {
        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly ISigningEmailService _signingEmailService;

        public SigningCompletedEmailDeliveryJob(
            IRepository<Signing, Guid> signingRepository,
            ISigningEmailService signingEmailService
            )
        {
            _signingRepository = signingRepository;
            _signingEmailService = signingEmailService;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(SigningCompletedEmailDeliveryJobArgs args)
        {
            Signing signing;
            using (UnitOfWorkManager.Current.DisableFilter(AbpDataFilters.MustHaveTenant))
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                signing = await _signingRepository.GetAsync(args.SigningId);
            }

            Check.NotNull(signing, nameof(signing));

            using (var uow = UnitOfWorkManager.Begin())
            using (UnitOfWorkManager.Current.SetTenantId(signing.TenantId))
            {
                await _signingEmailService.SendSigningCompletedAsync(signing);
                await uow.CompleteAsync();
            }
        }
    }
}
