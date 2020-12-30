using Abp.Authorization;
using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Realty.Authorization
{
    /// <summary>
    /// Application's authorization provider.
    /// Defines permissions for the application.
    /// See <see cref="AppPermissions"/> for all permission names.
    /// </summary>
    public class AppAuthorizationProvider : AuthorizationProvider
    {
        private readonly bool _isMultiTenancyEnabled;

        public AppAuthorizationProvider(bool isMultiTenancyEnabled)
        {
            _isMultiTenancyEnabled = isMultiTenancyEnabled;
        }

        public AppAuthorizationProvider(IMultiTenancyConfig multiTenancyConfig)
        {
            _isMultiTenancyEnabled = multiTenancyConfig.IsEnabled;
        }

        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            //COMMON PERMISSIONS (FOR BOTH OF TENANTS AND HOST)

            var pages = context.GetPermissionOrNull(AppPermissions.Pages) ?? context.CreatePermission(AppPermissions.Pages, L("Pages"));
            pages.CreateChildPermission(AppPermissions.Pages_DemoUiComponents, L("DemoUiComponents"));

            var administration = pages.CreateChildPermission(AppPermissions.Pages_Administration, L("Administration"));

            var roles = administration.CreateChildPermission(AppPermissions.Pages_Administration_Roles, L("Roles"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Create, L("CreatingNewRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Edit, L("EditingRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Delete, L("DeletingRole"));

            var users = administration.CreateChildPermission(AppPermissions.Pages_Administration_Users, L("Users"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Create, L("CreatingNewUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Edit, L("EditingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Delete, L("DeletingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_ChangePermissions, L("ChangingPermissions"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Impersonation, L("LoginForUsers"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Unlock, L("Unlock"));

            var languages = administration.CreateChildPermission(AppPermissions.Pages_Administration_Languages, L("Languages"));
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Create, L("CreatingNewLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Edit, L("EditingLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Delete, L("DeletingLanguages"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_ChangeTexts, L("ChangingTexts"));

            administration.CreateChildPermission(AppPermissions.Pages_Administration_AuditLogs, L("AuditLogs"));

            var organizationUnits = administration.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits, L("OrganizationUnits"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageOrganizationTree, L("ManagingOrganizationTree"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers, L("ManagingMembers"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageRoles, L("ManagingRoles"));

            administration.CreateChildPermission(AppPermissions.Pages_Administration_UiCustomization, L("VisualSettings"));

            var webhooks = administration.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription, L("Webhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Create, L("CreatingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Edit, L("EditingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_ChangeActivity, L("ChangingWebhookActivity"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Detail, L("DetailingSubscription"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ListSendAttempts, L("ListingSendAttempts"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ResendWebhook, L("ResendingWebhook"));

            var dynamicProperties = administration.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties, L("DynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Create, L("CreatingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Edit, L("EditingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Delete, L("DeletingDynamicProperties"));

            var dynamicPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue, L("DynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Create, L("CreatingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Edit, L("EditingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Delete, L("DeletingDynamicPropertyValue"));

            var dynamicEntityProperties = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties, L("DynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Create, L("CreatingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Edit, L("EditingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Delete, L("DeletingDynamicEntityProperties"));

            var dynamicEntityPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue, L("EntityDynamicPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Create, L("CreatingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Edit, L("EditingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Delete, L("DeletingDynamicEntityPropertyValue"));

            //TENANT-SPECIFIC PERMISSIONS

            var tenantAdmins = pages.CreateChildPermission(AppPermissions.Pages_Users_Admins, L("Admins"));
            tenantAdmins.CreateChildPermission(AppPermissions.Pages_Users_Admins_Create, L("CreatingNewAdmin"));
            tenantAdmins.CreateChildPermission(AppPermissions.Pages_Users_Admins_Edit, L("EditingAdmin"));
            tenantAdmins.CreateChildPermission(AppPermissions.Pages_Users_Admins_Delete, L("DeletingAdmin"));

            var tenantLeads = pages.CreateChildPermission(AppPermissions.Pages_Leads, L("Leads"));
            tenantLeads.CreateChildPermission(AppPermissions.Pages_Leads_Create, L("CreatingNewLead"));
            tenantLeads.CreateChildPermission(AppPermissions.Pages_Leads_Edit, L("EditingLead"));
            tenantLeads.CreateChildPermission(AppPermissions.Pages_Leads_Delete, L("DeletingLead"));
            tenantLeads.CreateChildPermission(AppPermissions.Pages_Leads_AccessAll, L("AccessAllLeads"));

            var tenantCustomers = pages.CreateChildPermission(AppPermissions.Pages_Users_Customers, L("Customers"));
            tenantCustomers.CreateChildPermission(AppPermissions.Pages_Users_Customers_Create, L("CreatingNewCustomer"));
            tenantCustomers.CreateChildPermission(AppPermissions.Pages_Users_Customers_Edit, L("EditingCustomer"));
            tenantCustomers.CreateChildPermission(AppPermissions.Pages_Users_Customers_Delete, L("DeletingCustomer"));
            tenantCustomers.CreateChildPermission(AppPermissions.Pages_Users_Customers_AccessAll, L("AccessAllCustomer"));

            var tenantAgents = pages.CreateChildPermission(AppPermissions.Pages_Users_Agents, L("Agents"));
            tenantAgents.CreateChildPermission(AppPermissions.Pages_Users_Agents_Create, L("CreatingNewAgent"));
            tenantAgents.CreateChildPermission(AppPermissions.Pages_Users_Agents_Edit, L("EditingAgent"));
            tenantAgents.CreateChildPermission(AppPermissions.Pages_Users_Agents_Delete, L("DeletingAgent"));

            var tenantLandlords = pages.CreateChildPermission(AppPermissions.Pages_Users_Landlords, L("Landlords"));
            tenantLandlords.CreateChildPermission(AppPermissions.Pages_Users_Landlords_Create, L("CreatingNewLandlord"));
            tenantLandlords.CreateChildPermission(AppPermissions.Pages_Users_Landlords_Edit, L("EditingLandlord"));
            tenantLandlords.CreateChildPermission(AppPermissions.Pages_Users_Landlords_Delete, L("DeletingLandlord"));

            var tenantTransactions = pages.CreateChildPermission(AppPermissions.Pages_Transactions, L("Transactions"));
            tenantTransactions.CreateChildPermission(AppPermissions.Pages_Transactions_Create, L("CreatingNewTransaction"));
            tenantTransactions.CreateChildPermission(AppPermissions.Pages_Transactions_Edit, L("EditingTransaction"));
            tenantTransactions.CreateChildPermission(AppPermissions.Pages_Transactions_Delete, L("DeletingTransaction"));
            tenantTransactions.CreateChildPermission(AppPermissions.Pages_Transactions_AccessAll, L("AccessAllTransaction"));

            var tenantSignings = pages.CreateChildPermission(AppPermissions.Pages_Signings, L("Signings"));
            tenantSignings.CreateChildPermission(AppPermissions.Pages_Signings_Create, L("CreatingNewSigning"));
            tenantSignings.CreateChildPermission(AppPermissions.Pages_Signings_Edit, L("EditingSigning"));
            tenantSignings.CreateChildPermission(AppPermissions.Pages_Signings_Delete, L("DeletingSigning"));
            tenantSignings.CreateChildPermission(AppPermissions.Pages_Signings_AccessAll, L("AccessAllSigning"));

            var tenantCommunications = administration.CreateChildPermission(AppPermissions.Pages_Communications, L("Communications"));
            tenantCommunications.CreateChildPermission(AppPermissions.Pages_Communications_AccessAll, L("AccessAllCommunications"));

            var tenantInvoices = pages.CreateChildPermission(AppPermissions.Pages_Invoices, L("Invoices"));
            tenantInvoices.CreateChildPermission(AppPermissions.Pages_Invoices_Create, L("CreatingNewInvoice"));
            tenantInvoices.CreateChildPermission(AppPermissions.Pages_Invoices_Edit, L("EditingInvoice"));
            tenantInvoices.CreateChildPermission(AppPermissions.Pages_Invoices_Delete, L("DeletingInvoice"));
            tenantInvoices.CreateChildPermission(AppPermissions.Pages_Invoices_AccessAll, L("AccessAllInvoice"));

            var tenantFormsLibrary = pages.CreateChildPermission(AppPermissions.Pages_Library_Forms, L("FormsLibrary"), multiTenancySides: MultiTenancySides.Tenant);
            tenantFormsLibrary.CreateChildPermission(AppPermissions.Pages_LibraryForms_Create, L("CreatingNewFormsLibrary"), multiTenancySides: MultiTenancySides.Tenant);
            tenantFormsLibrary.CreateChildPermission(AppPermissions.Pages_LibraryForms_Edit, L("EditingFormsLibrary"), multiTenancySides: MultiTenancySides.Tenant);
            tenantFormsLibrary.CreateChildPermission(AppPermissions.Pages_LibraryForms_Delete, L("DeletingFormsLibrary"), multiTenancySides: MultiTenancySides.Tenant);
            tenantFormsLibrary.CreateChildPermission(AppPermissions.Pages_LibraryForms_View, L("ViewFormsLibrary"), multiTenancySides: MultiTenancySides.Tenant);

            pages.CreateChildPermission(AppPermissions.Pages_Listings, L("Pages_Listings"));

            pages.CreateChildPermission(AppPermissions.Pages_Tenant_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Tenant);

            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_SubscriptionManagement, L("Subscription"), multiTenancySides: MultiTenancySides.Tenant);

            //HOST-SPECIFIC PERMISSIONS

            var editions = pages.CreateChildPermission(AppPermissions.Pages_Editions, L("Editions"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Create, L("CreatingNewEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Edit, L("EditingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Delete, L("DeletingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_MoveTenantsToAnotherEdition, L("MoveTenantsToAnotherEdition"), multiTenancySides: MultiTenancySides.Host);

            var tenants = pages.CreateChildPermission(AppPermissions.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Create, L("CreatingNewTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Edit, L("EditingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_ChangeFeatures, L("ChangingFeatures"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Delete, L("DeletingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Impersonation, L("LoginForTenants"), multiTenancySides: MultiTenancySides.Host);

            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Host);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Maintenance, L("Maintenance"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_HangfireDashboard, L("HangfireDashboard"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, RealtyConsts.LocalizationSourceName);
        }
    }
}
