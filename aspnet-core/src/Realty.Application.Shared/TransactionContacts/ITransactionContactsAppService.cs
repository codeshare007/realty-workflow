using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Contacts.Dto;
using Realty.TransactionContacts.Input;

namespace Realty.TransactionContacts
{
    public interface ITransactionContactsAppService : ITransientDependency
    {
        Task<PagedResultDto<ContactInfoDto>> GetAllAsync(GetTransactionContactsInput input);
        Task CreateAsync(CreateTransactionContactInput input);
        Task<ContactDto> GetForEditAsync(GetTransactionContactInput input);
        Task UpdateAsync(UpdateTransactionContactInput input);
        Task DeleteAsync(DeleteTransactionContactInput input);
    }
}
