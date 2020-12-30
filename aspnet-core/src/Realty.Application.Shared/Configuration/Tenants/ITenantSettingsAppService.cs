using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Configuration.Tenants.Dto;

namespace Realty.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
