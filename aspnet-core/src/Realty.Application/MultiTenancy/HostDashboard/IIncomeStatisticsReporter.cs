using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Realty.MultiTenancy.HostDashboard.Dto;

namespace Realty.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}