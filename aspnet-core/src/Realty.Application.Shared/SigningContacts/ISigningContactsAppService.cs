using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Contacts.Dto;
using Realty.SigningContacts.Input;

namespace Realty.SigningContacts
{
    public interface ISigningContactsAppService : ITransientDependency
    {
        Task<PagedResultDto<ContactInfoDto>> GetAllAsync(GetSigningContactsInput input);
        Task CreateAsync(CreateSigningContactInput input);
        Task<ContactDto> GetForEditAsync(GetSigningContactInput input);
        Task UpdateAsync(UpdateSigningContactInput input);
        Task DeleteAsync(DeleteSigningContactInput input);
    }
}
