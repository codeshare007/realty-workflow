using System.Threading.Tasks;
using Abp.Application.Services;
using Realty.Install.Dto;

namespace Realty.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}