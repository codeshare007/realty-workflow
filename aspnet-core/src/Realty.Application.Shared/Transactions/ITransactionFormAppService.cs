using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;

namespace Realty.Transactions
{
    public interface ITransactionFormAppService: ITransientDependency
    {
        Task<PagedResultDto<TransactionFormListDto>> GetAllAsync(GetTransactionFormsInput input);
        Task<Guid> CreateAsync(CreateTransactionFormInput input);
        Task<TransactionFormEditDto> GetForEditAsync(GetTransactionFormForEditInput input);
        Task UpdateAsync(UpdateTransactionFormInput input);
        Task DeleteAsync(DeleteTransactionFormInput input);
    }
}
