using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Realty.Authorization.Users.Dto;
using Realty.Dto;

namespace Realty.Authorization.Users
{
    public interface IUserAppService : IApplicationService
    {
        Task<PagedResultDto<UserListDto>> GetUsers(GetUsersInput input);

        Task<FileDto> GetUsersToExcel(GetUsersToExcelInput input);

        Task<GetUserForEditOutput> GetUserForEdit(UserIdentifierInput input);

        Task CreateOrUpdateUser(CreateOrUpdateUserInput input);

        Task DeleteUser(UserIdentifierInput input);

        Task UnlockUser(UserIdentifierInput input);
    }
}