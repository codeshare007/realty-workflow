using System;
using System.Threading.Tasks;
using Abp;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Realty.Signings.AccessRequests;

namespace Realty.Signings.Jobs
{
    public class ViewRequestCreatedEmailDeliveryJob: SigningCreatedEmailDeliveryJob<ViewRequestCreatedEmailDeliveryJobArgs>
    {
        private readonly IRepository<ViewRequest, Guid> _requestRepository;

        public ViewRequestCreatedEmailDeliveryJob(
            IRepository<ViewRequest, Guid> requestRepository,
            IRepository<Signing, Guid> signingRepository,
            ISigningEmailService signingEmailService
        ):base(signingRepository, signingEmailService)
        {
            _requestRepository = requestRepository;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(ViewRequestCreatedEmailDeliveryJobArgs args)
        {
            Check.NotNull(args.ViewRequestId, nameof(args.ViewRequestId));
            
            ViewRequest request;
            using (UnitOfWorkManager.Current.DisableFilter(AbpDataFilters.MustHaveTenant))
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                request = await _requestRepository.GetAsync(args.ViewRequestId);
            }

            await SendRequestCreatedAsync(request);
        }
    }
}
