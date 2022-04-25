using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Contacts.Dto;
using Realty.LeadContacts.Dto;
using Realty.LeadContacts.Input;

namespace Realty.LeadContacts
{
    public interface ILeadContactAppService : ITransientDependency
    {
        Task<PagedResultDto<ContactListDto>> GetAllAsync(GetLeadContactsInput input);
        Task CreateAsync(CreateLeadContactInput input);
        Task<LeadContactDto> GetForEditAsync(GetLeadContactInput input);
        Task UpdateAsync(UpdateLeadContactInput input);
        Task DeleteAsync(DeleteLeadContactInput input);
    }
}
