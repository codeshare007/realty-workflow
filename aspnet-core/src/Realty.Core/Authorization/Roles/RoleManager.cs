using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Localization;
using Abp.MultiTenancy;
using Abp.Organizations;
using Abp.Runtime.Caching;
using Abp.UI;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Realty.Authorization.Users;

namespace Realty.Authorization.Roles
{
    /// <summary>
    /// Role manager.
    /// Used to implement domain logic for roles.
    /// </summary>
    public class RoleManager : AbpRoleManager<Role, User>
    {
        private readonly ILocalizationManager _localizationManager;
        private readonly IPermissionManager _permissionManager;

        public RoleManager(
            RoleStore store,
            IEnumerable<IRoleValidator<Role>> roleValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            ILogger<RoleManager> logger,
            IPermissionManager permissionManager,
            IRoleManagementConfig roleManagementConfig,
            ICacheManager cacheManager,
            IUnitOfWorkManager unitOfWorkManager,
            ILocalizationManager localizationManager,
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<OrganizationUnitRole, long> organizationUnitRoleRepository)
            : base(
                store,
                roleValidators,
                keyNormalizer,
                errors,
                logger,
                permissionManager,
                cacheManager,
                unitOfWorkManager,
                roleManagementConfig,
                organizationUnitRepository,
                organizationUnitRoleRepository)
        {
            _localizationManager = localizationManager;
            _permissionManager = permissionManager;
        }

        public override Task SetGrantedPermissionsAsync(Role role, IEnumerable<Permission> permissions)
        {
            CheckPermissionsToUpdate(role, permissions);

            return base.SetGrantedPermissionsAsync(role, permissions);
        }

        public virtual async Task<Role> GetRoleByIdAsync(long roleId)
        {
            var role = await FindByIdAsync(roleId.ToString());
            if (role == null)
            {
                throw new ApplicationException("There is no role with id: " + roleId);
            }

            return role;
        }

        public async Task UpdateStaticRolePermissions(int? tenantId)
        {
            var staticRoles = RoleManagementConfig.StaticRoles
                .Where(s => (!tenantId.HasValue && s.Side == MultiTenancySides.Host) ||
                            (tenantId.HasValue && s.Side == MultiTenancySides.Tenant)).ToList();

            foreach (var item in staticRoles)
            {
                var role = Roles.FirstOrDefault(r => r.Name == item.RoleName);

                if (role != null)
                {
                    var grantedPermissions = _permissionManager.GetAllPermissions()
                        .Where(p => item.GrantedPermissions.Contains(p.Name));

                    await SetGrantedPermissionsAsync(role, grantedPermissions);
                }
            }
        }

        private void CheckPermissionsToUpdate(Role role, IEnumerable<Permission> permissions)
        {
            //if (role.Name == StaticRoleNames.Host.Admin &&
            //    (!permissions.Any(p => p.Name == AppPermissions.Pages_Administration_Roles_Edit) ||
            //     !permissions.Any(p => p.Name == AppPermissions.Pages_Administration_Users_ChangePermissions)))
            //{
            //    throw new UserFriendlyException(L("YouCannotRemoveUserRolePermissionsFromAdminRole"));
            //}
        }

        private new string L(string name)
        {
            return _localizationManager.GetString(RealtyConsts.LocalizationSourceName, name);
        }
    }
}
