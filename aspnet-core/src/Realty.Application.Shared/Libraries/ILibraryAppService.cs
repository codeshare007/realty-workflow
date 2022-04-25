using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Dto;
using Realty.Libraries.Input;
using Realty.Signings.Input;

namespace Realty.Libraries
{
    public interface ILibraryAppService: ITransientDependency
    {
        Task<PagedResultDto<LibraryListDto>> GetAllAsync(GetLibrariesInput input);
        Task<Guid> CreateAsync(CreateLibraryInput input);
        Task<LibraryEditDto> GetForEditAsync(Guid id);
        Task UpdateAsync(UpdateLibraryInput input);
        Task DeleteAsync(Guid id);
        Task<FileDto> DownloadOriginalDocumentAsync(DownloadOriginalDocumentInput input);
    }
}
