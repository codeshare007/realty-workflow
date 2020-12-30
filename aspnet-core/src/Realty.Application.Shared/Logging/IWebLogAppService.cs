using Abp.Application.Services;
using Realty.Dto;
using Realty.Logging.Dto;

namespace Realty.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
