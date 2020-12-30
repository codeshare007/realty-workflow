using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Signings.Dto;
using Realty.Signings.Input;

namespace Realty.Signings
{
    public interface ISigningFormAppService: ITransientDependency
    {
        Task<PagedResultDto<SigningFormListDto>> GetAllAsync(GetSigningFormsInput input);
        Task<Guid> CreateAsync(CreateSigningFormInput input);
        Task<SigningFormEditDto> GetForEditAsync(GetSigningFormForEditInput input);
        Task UpdateAsync(UpdateSigningFormInput input);
        Task DeleteAsync(DeleteSigningFormInput input);
    }
}
