namespace Realty.Authorization
{
    /// <summary>
    /// Defines string constants for application's permission names.
    /// <see cref="AppAuthorizationProvider"/> for permission definitions.
    /// </summary>
    public static class AppPermissions
    {
        //COMMON PERMISSIONS (FOR BOTH OF TENANTS AND HOST)

        public const string Pages = "Pages";

        public const string Pages_DemoUiComponents = "Pages.DemoUiComponents";
        public const string Pages_Administration = "Pages.Administration";

        public const string Pages_Administration_Roles = "Pages.Administration.Roles";
        public const string Pages_Administration_Roles_Create = "Pages.Administration.Roles.Create";
        public const string Pages_Administration_Roles_Edit = "Pages.Administration.Roles.Edit";
        public const string Pages_Administration_Roles_Delete = "Pages.Administration.Roles.Delete";

        public const string Pages_Administration_Users = "Pages.Administration.Users";
        public const string Pages_Administration_Users_Create = "Pages.Administration.Users.Create";
        public const string Pages_Administration_Users_Edit = "Pages.Administration.Users.Edit";
        public const string Pages_Administration_Users_Delete = "Pages.Administration.Users.Delete";
        public const string Pages_Administration_Users_ChangePermissions = "Pages.Administration.Users.ChangePermissions";
        public const string Pages_Administration_Users_Impersonation = "Pages.Administration.Users.Impersonation";
        public const string Pages_Administration_Users_Unlock = "Pages.Administration.Users.Unlock";

        public const string Pages_Administration_Languages = "Pages.Administration.Languages";
        public const string Pages_Administration_Languages_Create = "Pages.Administration.Languages.Create";
        public const string Pages_Administration_Languages_Edit = "Pages.Administration.Languages.Edit";
        public const string Pages_Administration_Languages_Delete = "Pages.Administration.Languages.Delete";
        public const string Pages_Administration_Languages_ChangeTexts = "Pages.Administration.Languages.ChangeTexts";

        public const string Pages_Administration_AuditLogs = "Pages.Administration.AuditLogs";

        public const string Pages_Administration_OrganizationUnits = "Pages.Administration.OrganizationUnits";
        public const string Pages_Administration_OrganizationUnits_ManageOrganizationTree = "Pages.Administration.OrganizationUnits.ManageOrganizationTree";
        public const string Pages_Administration_OrganizationUnits_ManageMembers = "Pages.Administration.OrganizationUnits.ManageMembers";
        public const string Pages_Administration_OrganizationUnits_ManageRoles = "Pages.Administration.OrganizationUnits.ManageRoles";

        public const string Pages_Administration_HangfireDashboard = "Pages.Administration.HangfireDashboard";

        public const string Pages_Administration_UiCustomization = "Pages.Administration.UiCustomization";

        public const string Pages_Administration_WebhookSubscription = "Pages.Administration.WebhookSubscription";
        public const string Pages_Administration_WebhookSubscription_Create = "Pages.Administration.WebhookSubscription.Create";
        public const string Pages_Administration_WebhookSubscription_Edit = "Pages.Administration.WebhookSubscription.Edit";
        public const string Pages_Administration_WebhookSubscription_ChangeActivity = "Pages.Administration.WebhookSubscription.ChangeActivity";
        public const string Pages_Administration_WebhookSubscription_Detail = "Pages.Administration.WebhookSubscription.Detail";
        public const string Pages_Administration_Webhook_ListSendAttempts = "Pages.Administration.Webhook.ListSendAttempts";
        public const string Pages_Administration_Webhook_ResendWebhook = "Pages.Administration.Webhook.ResendWebhook";

        public const string Pages_Administration_DynamicProperties = "Pages.Administration.DynamicProperties";
        public const string Pages_Administration_DynamicProperties_Create = "Pages.Administration.DynamicProperties.Create";
        public const string Pages_Administration_DynamicProperties_Edit = "Pages.Administration.DynamicProperties.Edit";
        public const string Pages_Administration_DynamicProperties_Delete = "Pages.Administration.DynamicProperties.Delete";

        public const string Pages_Administration_DynamicPropertyValue = "Pages.Administration.DynamicPropertyValue";
        public const string Pages_Administration_DynamicPropertyValue_Create = "Pages.Administration.DynamicPropertyValue.Create";
        public const string Pages_Administration_DynamicPropertyValue_Edit = "Pages.Administration.DynamicPropertyValue.Edit";
        public const string Pages_Administration_DynamicPropertyValue_Delete = "Pages.Administration.DynamicPropertyValue.Delete";

        public const string Pages_Administration_DynamicEntityProperties = "Pages.Administration.DynamicEntityProperties";
        public const string Pages_Administration_DynamicEntityProperties_Create = "Pages.Administration.DynamicEntityProperties.Create";
        public const string Pages_Administration_DynamicEntityProperties_Edit = "Pages.Administration.DynamicEntityProperties.Edit";
        public const string Pages_Administration_DynamicEntityProperties_Delete = "Pages.Administration.DynamicEntityProperties.Delete";

        public const string Pages_Administration_DynamicEntityPropertyValue = "Pages.Administration.DynamicEntityPropertyValue";
        public const string Pages_Administration_DynamicEntityPropertyValue_Create = "Pages.Administration.DynamicEntityPropertyValue.Create";
        public const string Pages_Administration_DynamicEntityPropertyValue_Edit = "Pages.Administration.DynamicEntityPropertyValue.Edit";
        public const string Pages_Administration_DynamicEntityPropertyValue_Delete = "Pages.Administration.DynamicEntityPropertyValue.Delete";

        //TENANT-SPECIFIC PERMISSIONS

        public const string Pages_Tenant_Dashboard = "Pages.Tenant.Dashboard";
        public const string Pages_Admin_Dashboard = "Pages.Admin.Dashboard";
        public const string Pages_Agent_Dashboard = "Pages.Agent.Dashboard";

        public const string Pages_Administration_Tenant_Settings = "Pages.Administration.Tenant.Settings";

        public const string Pages_Administration_Tenant_SubscriptionManagement = "Pages.Administration.Tenant.SubscriptionManagement";

        public const string Pages_Users_Admins = "Pages.Users.Admins";
        public const string Pages_Users_Admins_Create = "Pages.Users.Admins.Create";
        public const string Pages_Users_Admins_Edit = "Pages.Users.Admins.Edit";
        public const string Pages_Users_Admins_Delete = "Pages.Users.Admins.Delete";

        public const string Pages_Users_Customers = "Pages.Users.Customers";
        public const string Pages_Users_Customers_Create = "Pages.Users.Customers.Create";
        public const string Pages_Users_Customers_Edit = "Pages.Users.Customers.Edit";
        public const string Pages_Users_Customers_Delete = "Pages.Users.Customers.Delete";
        public const string Pages_Users_Customers_AccessAll = "Pages.Users.Customers.AccessAll";

        public const string Pages_Users_Agents = "Pages.Users.Agents";
        public const string Pages_Users_Agents_Create = "Pages.Users.Agents.Create";
        public const string Pages_Users_Agents_Edit = "Pages.Users.Agents.Edit";
        public const string Pages_Users_Agents_Delete = "Pages.Users.Agents.Delete";

        public const string Pages_Users_Landlords = "Pages.Users.Landlords";
        public const string Pages_Users_Landlords_Create = "Pages.Users.Landlords.Create";
        public const string Pages_Users_Landlords_Edit = "Pages.Users.Landlords.Edit";
        public const string Pages_Users_Landlords_Delete = "Pages.Users.Landlords.Delete";

        public const string Pages_Transactions = "Pages.Transactions";
        public const string Pages_Transactions_Create = "Pages.Transactions.Create";
        public const string Pages_Transactions_Edit = "Pages.Transactions.Edit";
        public const string Pages_Transactions_Delete = "Pages.Transactions.Delete";
        public const string Pages_Transactions_AccessAll = "Pages.Transactions.AccessAll";

        public const string Pages_Leads = "Pages.Leads";
        public const string Pages_Leads_Create = "Pages.Leads.Create";
        public const string Pages_Leads_Edit = "Pages.Leads.Edit";
        public const string Pages_Leads_Delete = "Pages.Leads.Delete";
        public const string Pages_Leads_AccessAll = "Pages.Leads.AccessAll";

        public const string Pages_Signings = "Pages.Signings";
        public const string Pages_Signings_Create = "Pages.Signings.Create";
        public const string Pages_Signings_Edit = "Pages.Signings.Edit";
        public const string Pages_Signings_Delete = "Pages.Signings.Delete";
        public const string Pages_Signings_AccessAll = "Pages.Signings.AccessAll";

        public const string Pages_Communications = "Pages.Communications";
        public const string Pages_Communications_AccessAll = "Pages.Communications.AccessAll";

        public const string Pages_Invoices = "Pages.Invoices";
        public const string Pages_Invoices_Create = "Pages.Invoices.Create";
        public const string Pages_Invoices_Edit = "Pages.Invoices.Edit";
        public const string Pages_Invoices_Delete = "Pages.Invoices.Delete";
        public const string Pages_Invoices_AccessAll = "Pages.Invoices.AccessAll";

        public const string Pages_Library_Forms = "Pages.FormsLibrary";
        public const string Pages_LibraryForms_Create = "Pages.FormsLibrary.Create";
        public const string Pages_LibraryForms_Edit = "Pages.FormsLibrary.Edit";
        public const string Pages_LibraryForms_Delete = "Pages.FormsLibrary.Delete";
        public const string Pages_LibraryForms_View = "Pages.FormsLibrary.View";

        public const string Pages_Listings = "Pages.Listings";
        
        //HOST-SPECIFIC PERMISSIONS

        public const string Pages_Editions = "Pages.Editions";
        public const string Pages_Editions_Create = "Pages.Editions.Create";
        public const string Pages_Editions_Edit = "Pages.Editions.Edit";
        public const string Pages_Editions_Delete = "Pages.Editions.Delete";
        public const string Pages_Editions_MoveTenantsToAnotherEdition = "Pages.Editions.MoveTenantsToAnotherEdition";

        public const string Pages_Tenants = "Pages.Tenants";
        public const string Pages_Tenants_Create = "Pages.Tenants.Create";
        public const string Pages_Tenants_Edit = "Pages.Tenants.Edit";
        public const string Pages_Tenants_ChangeFeatures = "Pages.Tenants.ChangeFeatures";
        public const string Pages_Tenants_Delete = "Pages.Tenants.Delete";
        public const string Pages_Tenants_Impersonation = "Pages.Tenants.Impersonation";

        public const string Pages_Administration_Host_Maintenance = "Pages.Administration.Host.Maintenance";
        public const string Pages_Administration_Host_Settings = "Pages.Administration.Host.Settings";
        public const string Pages_Administration_Host_Dashboard = "Pages.Administration.Host.Dashboard";

    }
}