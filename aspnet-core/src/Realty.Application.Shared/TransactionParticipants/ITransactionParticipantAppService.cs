using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Contacts.Dto;
using Realty.TransactionParticipants.Dto;
using Realty.TransactionParticipants.Input;

namespace Realty.TransactionParticipants
{
    public interface ITransactionParticipantAppService : ITransientDependency
    {
        Task<PagedResultDto<ContactListDto>> GetAllAsync(GetTransactionParticipantsInput input);
        Task CreateAsync(CreateTransactionParticipantInput input);
        Task<TransactionParticipantDto> GetForEditAsync(GetTransactionParticipantInput input);
        Task UpdateAsync(UpdateTransactionParticipantInput input);
        Task DeleteAsync(DeleteTransactionParticipantInput input);
    }
}
