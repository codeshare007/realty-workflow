using Abp.Authorization;
using Realty.Authorization.Roles;
using Realty.Authorization.Users;

namespace Realty.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
