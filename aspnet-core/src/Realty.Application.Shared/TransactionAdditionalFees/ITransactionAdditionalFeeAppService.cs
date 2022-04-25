using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Realty.TransactionAdditionalFees.Dto;

namespace Realty.TransactionAdditionalFees
{
    public interface ITransactionAdditionalFeeAppService : ITransientDependency
    {
        Task<List<TransactionAdditionalFeeDto>> GetListAsync(GetTransactionAdditionalFeeListInput input);
        Task<Guid> CreateAsync(CreateTransactionAdditionalFeeInput input);
        Task<TransactionAdditionalFeeDto> GetAsync(GetTransactionAdditionalFeeInput input);
        Task<Guid> UpdateAsync(UpdateTransactionAdditionalFeeInput input);
        Task DeleteAsync(DeleteTransactionAdditionalFeeInput input);
    }
}
