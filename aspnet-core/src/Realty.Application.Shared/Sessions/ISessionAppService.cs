using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Sessions.Dto;

namespace Realty.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
