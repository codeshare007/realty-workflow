using System;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Abp.Timing;
using Microsoft.EntityFrameworkCore;
using Realty.Signings;

namespace Realty.Web.Workers
{
    public class SigningRequestReminderEmailDeliveryWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private const int CheckPeriodAsMilliseconds = 1 * 60 * 60 * 1000; //1 hour

        private readonly IRepository<Signing, Guid> _signingRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ISigningEmailService _signingEmailService;
        
        public SigningRequestReminderEmailDeliveryWorker(
            IRepository<Signing, Guid> signingRepository,
            IUnitOfWorkManager unitOfWorkManager,
            ISigningEmailService signingEmailService,
            AbpTimer timer
        ) : base(timer)
        {
            _signingRepository = signingRepository;
            _signingEmailService = signingEmailService;
            _unitOfWorkManager = unitOfWorkManager;

            Timer.Period = CheckPeriodAsMilliseconds;
            Timer.RunOnStart = true;

            LocalizationSourceName = RealtyConsts.LocalizationSourceName;
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            AsyncHelper.RunSync(DispatchRemindersAsync);
        }

        private async Task DispatchRemindersAsync()
        {
            var signings = await _signingRepository.GetAll()
                .Where(s => s.ReminderSettings != null && 
                            s.ReminderSettings.NextDispatchTime.HasValue &&
                            s.SigningRequests.Any(r => r.Status == SigningRequestStatus.Pending))
                .Include(s => s.SigningRequests)
                .ToListAsync();

            foreach (var signing in signings)
            {
                Check.NotNull(signing.ReminderSettings, nameof(signing.ReminderSettings));

                if (Clock.Now < signing.ReminderSettings.NextDispatchTime) continue;

                using var uow =_unitOfWorkManager.Begin();
                using (_unitOfWorkManager.Current.SetTenantId(signing.TenantId))
                {
                    await DispatchSigningRemindersAsync(signing);
                    SetNextReminderTime(signing);

                    await _signingRepository.UpdateAsync(signing);
                    await _unitOfWorkManager.Current.SaveChangesAsync();
                    await uow.CompleteAsync();
                }
            }
        }

        private async Task DispatchSigningRemindersAsync(Signing signing)
        {
            var requests = signing.SigningRequests
                .Where(r => r.Status != SigningRequestStatus.Completed)
                .ToList();

            foreach (var request in requests)
            {
                await _signingEmailService.SendAccessRequestReminderAsync(signing, request);
            }
        }

        private void SetNextReminderTime(Signing signing)
        {
            if (signing.ReminderSettings.DispatchingFrequency == ReminderFrequency.Never) return;

            // Set next dispatch time according to the frequency
            signing.ReminderSettings.SetNextDispatchTime(
                GetNextDispatchTime(signing.ReminderSettings.DispatchingFrequency)
            );
        }

        private static DateTime GetNextDispatchTime(ReminderFrequency frequency)
        {
            return frequency switch
            {
                ReminderFrequency.Never => throw new ArgumentOutOfRangeException(nameof(frequency), frequency, null),
                ReminderFrequency.EachHour => Clock.Now.AddHours(1),
                ReminderFrequency.Each2Hours => Clock.Now.AddHours(2),
                ReminderFrequency.Each4Hours => Clock.Now.AddHours(4),
                ReminderFrequency.Each6Hours => Clock.Now.AddHours(6),
                ReminderFrequency.Each12Hours => Clock.Now.AddHours(12),
                ReminderFrequency.Each24Hours => Clock.Now.AddHours(24),
                ReminderFrequency.Each32Hours => Clock.Now.AddHours(32),
                ReminderFrequency.Each48Hours => Clock.Now.AddHours(48),
                _ => throw new ArgumentOutOfRangeException(nameof(frequency), frequency, null)
            };
        }
    }
}
