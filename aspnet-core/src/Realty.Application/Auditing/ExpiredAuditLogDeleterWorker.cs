using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Auditing;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.EFPlus;
using Abp.Logging;
using Abp.Threading;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Abp.Timing;
using Realty.MultiTenancy;

namespace Realty.Auditing
{
    public class ExpiredAuditLogDeleterWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        /// <summary>
        /// Set this const field to true if you want to enable ExpiredAuditLogDeleterWorker.
        /// Be careful, If you enable this, all expired logs will be permanently deleted.
        /// </summary>
        public const bool IsEnabled = false;

        private const int CheckPeriodAsMilliseconds = 1 * 1000 * 60 * 3; // 3min
        private const int MaxDeletionCount = 10000;

        private readonly TimeSpan _logExpireTime = TimeSpan.FromDays(7);
        private readonly IRepository<AuditLog, long> _auditLogRepository;
        private readonly IRepository<Tenant> _tenantRepository;

        public ExpiredAuditLogDeleterWorker(
            AbpTimer timer,
            IRepository<AuditLog, long> auditLogRepository,
            IRepository<Tenant> tenantRepository
            )
            : base(timer)
        {
            _auditLogRepository = auditLogRepository;
            _tenantRepository = tenantRepository;

            LocalizationSourceName = RealtyConsts.LocalizationSourceName;

            Timer.Period = CheckPeriodAsMilliseconds;
            Timer.RunOnStart = true;
        }

        protected override void DoWork()
        {
            var expireDate = Clock.Now - _logExpireTime;

            List<int> tenantIds;
            using (var uow = UnitOfWorkManager.Begin())
            {
                tenantIds = _tenantRepository.GetAll()
                    .Where(t => !string.IsNullOrEmpty(t.ConnectionString))
                    .Select(t => t.Id)
                    .ToList();

                uow.Complete();
            }

            DeleteAuditLogsOnHostDatabase(expireDate);

            foreach (var tenantId in tenantIds)
            {
                DeleteAuditLogsOnTenantDatabase(tenantId, expireDate);
            }
        }

        protected virtual void DeleteAuditLogsOnHostDatabase(DateTime expireDate)
        {
            try
            {
                using (var uow = UnitOfWorkManager.Begin())
                {
                    using (CurrentUnitOfWork.SetTenantId(null))
                    {
                        using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
                        {
                            DeleteAuditLogs(expireDate);
                            uow.Complete();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Log(LogSeverity.Error, $"An error occured while deleting audit logs on host database", e);
            }
        }

        protected virtual void DeleteAuditLogsOnTenantDatabase(int tenantId, DateTime expireDate)
        {
            try
            {
                using (var uow = UnitOfWorkManager.Begin())
                {
                    using (CurrentUnitOfWork.SetTenantId(tenantId))
                    {
                        DeleteAuditLogs(expireDate);
                        uow.Complete();
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Log(LogSeverity.Error, $"An error occured while deleting audit log for tenant. TenantId: {tenantId}", e);
            }
        }

        private void DeleteAuditLogs(DateTime expireDate)
        {
            var expiredEntryCount = _auditLogRepository.LongCount(l => l.ExecutionTime < expireDate);

            if (expiredEntryCount == 0)
            {
                return;
            }

            if (expiredEntryCount > MaxDeletionCount)
            {
                var deleteStartId = _auditLogRepository.GetAll().OrderBy(l => l.Id).Skip(MaxDeletionCount).Select(x => x.Id).First();

                AsyncHelper.RunSync(() => _auditLogRepository.BatchDeleteAsync(l => l.Id < deleteStartId));
            }
            else
            {
                AsyncHelper.RunSync(() => _auditLogRepository.BatchDeleteAsync(l => l.ExecutionTime < expireDate));
            }
        }
    }
}
