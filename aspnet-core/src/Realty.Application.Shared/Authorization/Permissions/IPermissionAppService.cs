using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Realty.Authorization.Permissions.Dto;

namespace Realty.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
