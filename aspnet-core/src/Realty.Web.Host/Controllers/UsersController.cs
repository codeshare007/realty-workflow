using Abp.AspNetCore.Mvc.Authorization;
using Realty.Authorization;
using Realty.Storage;
using Abp.BackgroundJobs;

namespace Realty.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}