using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Realty.TransactionPaymentTrackers.Dto;

namespace Realty.TransactionPaymentTrackers
{
    public interface ITransactionPaymentTrackerAppService : ITransientDependency
    {
        Task<TransactionPaymentTrackerDto> GetAsync(GetTransactionPaymentTrackerInput input);
        Task UpdateAsync(UpdateTransactionPaymentTrackerInput input);
    }
}
