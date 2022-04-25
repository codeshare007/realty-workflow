using System;
using System.Threading.Tasks;
using Abp;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Realty.Signings.AccessRequests;

namespace Realty.Signings.Jobs
{
    public class SigningRequestCreatedEmailDeliveryJob: SigningCreatedEmailDeliveryJob<SigningRequestCreatedEmailDeliveryJobArgs>
    {
        private readonly IRepository<SigningRequest, Guid> _requestRepository;
        
        public SigningRequestCreatedEmailDeliveryJob(
            IRepository<SigningRequest, Guid> requestRepository,
            IRepository<Signing, Guid> signingRepository,
            ISigningEmailService signingEmailService
        ):base(signingRepository, signingEmailService)
        {
            _requestRepository = requestRepository;
        }

        [UnitOfWork]
        protected override async Task ExecuteAsync(SigningRequestCreatedEmailDeliveryJobArgs args)
        {
            Check.NotNull(args.SigningRequestId, nameof(args.SigningRequestId));
            
            SigningRequest request;
            using (UnitOfWorkManager.Current.DisableFilter(AbpDataFilters.MustHaveTenant))
            using (UnitOfWorkManager.Current.SetTenantId(null))
            {
                request = await _requestRepository.GetAsync(args.SigningRequestId);
            }

            await SendRequestCreatedAsync(request);
        }
    }
}
