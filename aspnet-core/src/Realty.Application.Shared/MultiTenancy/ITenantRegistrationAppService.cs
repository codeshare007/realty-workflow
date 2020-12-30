using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Editions.Dto;
using Realty.MultiTenancy.Dto;

namespace Realty.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}