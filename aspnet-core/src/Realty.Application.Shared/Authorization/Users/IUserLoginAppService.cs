using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Realty.Authorization.Users.Dto;

namespace Realty.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<ListResultDto<UserLoginAttemptDto>> GetRecentUserLoginAttempts();
    }
}
