using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Dto;
using Realty.Signings.Input;
using Realty.Transactions.Dto;
using Realty.Transactions.Input;
using Realty.Transactios.Input;

namespace Realty.Transactions
{
    public interface ITransactionAppService: ITransientDependency
    {
        Task<List<TransactionSearchDto>> SearchTransaction(SearchTransactionsInput input);
        Task<Guid> DuplicateTransactionAsync(DuplicateTransactionInput input);
        Task<PagedResultDto<TransactionListDto>> GetAllAsync(GetTransactionsInput input);
        Task<Guid> CreateAsync(CreateTransactionInput input);
        Task<TransactionEditDto> GetForEditAsync(Guid input);
        Task<Guid> UpdateAsync(UpdateTransactionInput input);
        Task DeleteAsync(Guid id);
        
        Task<PagedResultDto<TransactionAttachmentListDto>> GetAttachmentsAsync(GetTransactionAttachmentsInput input);
        Task CreateAttachmentAsync(CreateTransactionAttachmentInput input);
        Task DeleteAttachmentAsync(DeleteTransactionAttachmentInput input);
        Task<FileDto> DownloadAttachmentAsync(DownloadTransactionAttachmentInput input);
        Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input);
    }
}
