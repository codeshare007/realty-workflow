using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Realty.EntityFrameworkCore;

namespace Realty.HealthChecks
{
    public class RealtyDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public RealtyDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("RealtyDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("RealtyDbContext could not connect to database"));
        }
    }
}
