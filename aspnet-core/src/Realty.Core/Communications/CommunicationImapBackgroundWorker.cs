using System;
using System.Collections.Generic;
using System.Linq;
using Abp.BackgroundJobs;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;

namespace Realty.Communications
{
    public class CommunicationImapBackgroundWorker : PeriodicBackgroundWorkerBase, ITransientDependency
    {
        private readonly IRepository<Setting, long> _settingRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CommunicationImapBackgroundWorker(
            AbpTimer timer,
            IRepository<Setting, long> settingRepository,
            IBackgroundJobManager backgroundJobManager
        )
            : base(timer)
        {
            _settingRepository = settingRepository;
            _backgroundJobManager = backgroundJobManager;

            LocalizationSourceName = RealtyConsts.LocalizationSourceName;

            Timer.Period = (int) TimeSpan.FromMinutes(15).TotalMilliseconds;
            Timer.RunOnStart = true;
        }

        [UnitOfWork]
        protected override void DoWork()
        {
            foreach (var userId in GetUsersWithEnabledImap())
            {
                _backgroundJobManager.Enqueue<CommunicationImapBackgroundJob, CommunicationImapBackgroundJobArgs>(
                    new CommunicationImapBackgroundJobArgs {UserId = userId}
                );
            }
        }

        private IEnumerable<long> GetUsersWithEnabledImap()
        {
            using var _ = UnitOfWorkManager.Current.DisableFilter(
                AbpDataFilters.MayHaveTenant,
                AbpDataFilters.MustHaveTenant
            );

            return _settingRepository.GetAll()
                .Where(
                    setting => setting.Name == CommunicationSettingNames.Imap.IsEnabled
                               && setting.Value == "true"
                               && setting.UserId != null
                )
                .Select(setting => setting.UserId.Value)
                .Distinct()
                .ToList();
        }
    }
}
