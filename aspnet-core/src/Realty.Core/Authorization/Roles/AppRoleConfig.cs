using Abp.MultiTenancy;
using Abp.Zero.Configuration;
using System.Collections.Generic;

namespace Realty.Authorization.Roles
{
    public static class AppRoleConfig
    {
        public static void Configure(IRoleManagementConfig roleManagementConfig)
        {
            //Static host roles

            roleManagementConfig.StaticRoles.Add(
                new StaticRoleDefinition(
                    StaticRoleNames.Host.Admin,
                    MultiTenancySides.Host,
                    grantAllPermissionsByDefault: true)
                );

            //Static tenant roles

            var tenantAdminRole = new StaticRoleDefinition(
                    StaticRoleNames.Tenants.Admin,
                    MultiTenancySides.Tenant);

            tenantAdminRole.GrantedPermissions.AddRange(new List<string>()
            {
                AppPermissions.Pages_Admin_Dashboard,

                AppPermissions.Pages_Administration_Users_Unlock,

                AppPermissions.Pages_Users_Admins,
                AppPermissions.Pages_Users_Admins_Create,
                AppPermissions.Pages_Users_Admins_Edit,
                AppPermissions.Pages_Users_Admins_Delete,
                
                AppPermissions.Pages_Leads,
                AppPermissions.Pages_Leads_Create,
                AppPermissions.Pages_Leads_Edit,
                AppPermissions.Pages_Leads_Delete,
                AppPermissions.Pages_Leads_AccessAll,

                AppPermissions.Pages_Users_Customers,
                AppPermissions.Pages_Users_Customers_Create,
                AppPermissions.Pages_Users_Customers_Edit,
                AppPermissions.Pages_Users_Customers_Delete,
                AppPermissions.Pages_Users_Customers_AccessAll,

                AppPermissions.Pages_Users_Agents,
                AppPermissions.Pages_Users_Agents_Create,
                AppPermissions.Pages_Users_Agents_Edit,
                AppPermissions.Pages_Users_Agents_Delete,
                
                AppPermissions.Pages_Users_Landlords,
                AppPermissions.Pages_Users_Landlords_Create,
                AppPermissions.Pages_Users_Landlords_Edit,
                AppPermissions.Pages_Users_Landlords_Delete,
                
                AppPermissions.Pages_Transactions,
                AppPermissions.Pages_Transactions_Create,
                AppPermissions.Pages_Transactions_Edit,
                AppPermissions.Pages_Transactions_Delete,
                AppPermissions.Pages_Transactions_AccessAll,

                AppPermissions.Pages_Signings,
                AppPermissions.Pages_Signings_Create,
                AppPermissions.Pages_Signings_Edit,
                AppPermissions.Pages_Signings_Delete,
                AppPermissions.Pages_Signings_AccessAll,

                AppPermissions.Pages_Communications,
                AppPermissions.Pages_Communications_AccessAll,

                AppPermissions.Pages_Invoices,
                AppPermissions.Pages_Invoices_Create,
                AppPermissions.Pages_Invoices_Edit,
                AppPermissions.Pages_Invoices_Delete,
                AppPermissions.Pages_Invoices_AccessAll,

                AppPermissions.Pages_Library_Forms,
                AppPermissions.Pages_LibraryForms_Create,
                AppPermissions.Pages_LibraryForms_Edit,
                AppPermissions.Pages_LibraryForms_Delete,
            });

            roleManagementConfig.StaticRoles.Add(tenantAdminRole);


            var tenantAgentRole = new StaticRoleDefinition(
                                StaticRoleNames.Tenants.Agent,
                                MultiTenancySides.Tenant);

            tenantAgentRole.GrantedPermissions.AddRange(new List<string>()
            {
                AppPermissions.Pages_Agent_Dashboard,
                
                AppPermissions.Pages_Users_Customers,
                AppPermissions.Pages_Users_Customers_Create,
                AppPermissions.Pages_Users_Customers_Edit,
                AppPermissions.Pages_Users_Customers_Delete,
                
                AppPermissions.Pages_Transactions,
                AppPermissions.Pages_Transactions_Create,
                AppPermissions.Pages_Transactions_Edit,
                AppPermissions.Pages_Transactions_Delete,

                AppPermissions.Pages_Leads,
                AppPermissions.Pages_Leads_Create,
                AppPermissions.Pages_Leads_Edit,
                AppPermissions.Pages_Leads_Delete,

                AppPermissions.Pages_Signings,
                AppPermissions.Pages_Signings_Create,
                AppPermissions.Pages_Signings_Edit,
                AppPermissions.Pages_Signings_Delete,
                
                AppPermissions.Pages_Communications,

                AppPermissions.Pages_Invoices,
                AppPermissions.Pages_Invoices_Create,
                AppPermissions.Pages_Invoices_Edit,
                AppPermissions.Pages_Invoices_Delete,

                AppPermissions.Pages_LibraryForms_View,
            });

            roleManagementConfig.StaticRoles.Add(tenantAgentRole);

            var tenantCustomerRole = new StaticRoleDefinition(
                    StaticRoleNames.Tenants.Customer,
                    MultiTenancySides.Tenant);

            tenantCustomerRole.GrantedPermissions.AddRange(new List<string>()
            {
                AppPermissions.Pages_Listings,
            });

            roleManagementConfig.StaticRoles.Add(tenantCustomerRole);

        }
    }
}
