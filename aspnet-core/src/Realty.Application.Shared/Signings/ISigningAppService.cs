using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Dto;
using Realty.Signings.Dto;
using Realty.Signings.Input;

namespace Realty.Signings
{
    public interface ISigningAppService: ITransientDependency
    {
        Task<PagedResultDto<SigningListDto>> GetAllAsync(GetSigningsInput input);
        Task<Guid> CreateAsync(CreateSigningInput input);
        Task<SigningEditDto> GetForEditAsync(Guid input);
        Task<Guid> UpdateAsync(UpdateSigningInput input);
        Task DeleteAsync(Guid id);
        Task<SigningFormDto> GetForSigningAsync(GetSigningInput input);
        Task<SigningFormDto> GetForViewAsync(GetSigningInput input);
        Task CompleteSigningRequestAsync(CompleteSigningRequestInput input);
        Task<Guid> ResetSigningAsync(ResetSigningInput input);
        Task RejectSigningRequestAsync(RejectSigningRequestInput input);
        Task PublishSigningAsync(PublishSigningInput input);
        Task<SigningSummaryDto> GetSummaryAsync(GetSummaryInput input);
        Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input);
        Task<FileDto> DownloadSignedDocumentAsync(DownloadSignedDocumentInput input);
        Task<FileDto> DownloadFinalDocumentAsync(DownloadFinalDocumentInput input);
        Task<Guid> DuplicateSigningAsync(DuplicateSigningInput input);
        Task<Guid?> CreateWithTransactionFormsAsync(CreateWithTransactionFormsInput input);
        Task<PagedResultDto<SigningAttachmentListDto>> GetAttachmentsAsync(GetSigningAttachmentsInput input);
        Task<FileDto> DownloadAttachmentAsync(DownloadSigningAttachmentInput input);
    }
}
