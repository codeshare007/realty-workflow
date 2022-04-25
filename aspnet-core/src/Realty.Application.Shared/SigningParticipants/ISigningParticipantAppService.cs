using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Realty.Contacts.Dto;
using Realty.SigningParticipants.Dto;
using Realty.SigningParticipants.Input;

namespace Realty.SigningParticipants
{
    public interface ISigningParticipantAppService : ITransientDependency
    {
        Task<PagedResultDto<ContactListDto>> GetAllAsync(GetSigningParticipantsInput input);
        Task<List<SigningAccessRequestDto>> GetAllAccessRequstsAsync(GetSigningParticipantsInput input);
        Task CreateAsync(CreateSigningParticipantInput input);
        Task<ContactDto> GetForEditAsync(GetSigningParticipantInput input);
        Task UpdateAsync(UpdateSigningParticipantInput input);
        Task DeleteAsync(DeleteSigningParticipantInput input);
    }
}
