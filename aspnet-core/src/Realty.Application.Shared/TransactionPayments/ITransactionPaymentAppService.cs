using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Realty.TransactionPayments.Dto;

namespace Realty.TransactionPayments
{
    public interface ITransactionPaymentAppService : ITransientDependency
    {
        Task<List<TransactionPaymentListDto>> GetPaymentsAsync(GetPaymentsInput input);
        Task<Guid> CreatePaymentAsync(CreatePaymentInput input);
        Task<TransactionPaymentDto> GetPaymentAsync(GetPaymentInput input);
        Task<Guid> UpdatePaymentAsync(UpdatePaymentInput input);
        Task DeletePaymentAsync(DeletePaymentInput input);
    }
}
