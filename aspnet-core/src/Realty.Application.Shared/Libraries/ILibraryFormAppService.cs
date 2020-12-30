using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Libraries.Dto;
using Realty.Libraries.Input;

namespace Realty.Libraries
{
    public interface ILibraryFormAppService: ITransientDependency
    {
        Task<PagedResultDto<LibraryFormListDto>> GetAllAsync(GetLibraryFormsInput input);
        Task<Guid> CreateAsync(CreateLibraryFormInput input);
        Task<LibraryFormEditDto> GetForEditAsync(GetLibraryFormForEditInput input);
        Task UpdateAsync(UpdateLibraryFormInput input);
        Task DeleteAsync(DeleteLibraryFormInput input);
    }
}
