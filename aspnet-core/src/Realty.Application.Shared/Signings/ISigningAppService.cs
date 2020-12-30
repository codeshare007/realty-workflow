using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
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
    }
}
