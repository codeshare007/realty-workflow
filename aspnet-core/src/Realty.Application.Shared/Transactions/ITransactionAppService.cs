using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;

namespace Realty.Transactions
{
    public interface ITransactionAppService: ITransientDependency
    {
        Task<PagedResultDto<TransactionListDto>> GetAllAsync(GetTransactionsInput input);
        Task<Guid> CreateAsync(CreateTransactionInput input);
        Task<TransactionEditDto> GetForEditAsync(Guid input);
        Task<Guid> UpdateAsync(UpdateTransactionInput input);
        Task DeleteAsync(Guid id);
    }
}
