import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DynamicEntityPropertyComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/dynamic-entity-property.component';
import { DynamicEntityPropertyValueComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/value/dynamic-entity-property-value.component';
import { DynamicPropertyComponent } from '@app/admin/dynamic-properties/dynamic-property.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { CommunicationsComponent } from './communications/communications.component';
import { ContactsPageComponent } from './contacts/page/contacts-page.component';
import { CustomersPageComponent } from './customers/customers-page.component';
import { ManageCustomersComponent } from './customers/manage-customers.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { LeadDetailComponent } from './leads/lead-detail/lead-detail.page.component';
import { LeadsComponent } from './leads/leads.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { TransactionsComponent } from './transactions/transactions/transactions.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';
import { WebhookEventDetailComponent } from './webhook-subscription/webhook-event-detail.component';
import { WebhookSubscriptionDetailComponent } from './webhook-subscription/webhook-subscription-detail.component';
import { WebhookSubscriptionComponent } from './webhook-subscription/webhook-subscription.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'leads', component: LeadsComponent, data: { permission: 'Pages.Leads' } },
                    { path: 'lead/create', component: LeadDetailComponent, data: { permission: 'Pages.Leads', isCreate: true } },
                    { path: 'lead/:id', component: LeadDetailComponent, data: { permission: 'Pages.Leads' } },
                    { path: 'lead/:id/search-listings', component: LeadDetailComponent, data: { permission: 'Pages.Leads', searchListings: true } },
                    { path: 'customers', component: CustomersPageComponent, data: { permission: 'Pages.Users.Customers', userRole: 'Customer', userRoleName: 'Customer' } },
                    { path: 'listings', component: TransactionsComponent, data: { permission: 'Pages.Listings' } },
                    { path: 'communications', component: CommunicationsComponent, data: { permission: 'Pages.Communications' } },
                    { path: 'invoices', component: TransactionsComponent, data: { permission: 'Pages.Invoices' } },
                    { path: 'contacts', component: ContactsPageComponent },
                    // TODO: jaerbi => permission: Pages.FormsLibrary
                    //  data: { permission: ' ... ', preload: true}
                    {
                        path: 'forms-library',
                        loadChildren: () => import('app/admin/forms-library/forms-library.module').then(m => m.FormsLibraryModule),
                        data: { permission: 'Pages.FormsLibrary', preload: true }
                    },
                    {
                        path: 'transactions',
                        loadChildren: () => import('app/admin/transactions/transactions.module').then(m => m.TransactionsModule),
                        data: { permission: 'Pages.Transactions', preload: true }
                    },
                    {
                        path: 'signings',
                        loadChildren: () => import('app/admin/signings/signings.module').then(m => m.SigningsModule),
                        data: { permission: 'Pages.Signings', preload: true }
                    },

                    { path: 'admins', component: UsersComponent, data: { permission: 'Pages.Users.Admins', userRole: 'Admin', userRoleName: 'Admin' } },
                    { path: 'agents', component: UsersComponent, data: { permission: 'Pages.Users.Agents', userRole: 'Agent', userRoleName: 'Agent' } },
                    { path: 'landlords', component: UsersComponent, data: { permission: 'Pages.Users.Landlords', userRole: 'Landlord', userRoleName: 'Landlord' } },


                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'customer/:id/tab/edit-tab', component: ManageCustomersComponent, data: { permission: 'Pages.Users.Customers' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },
                    //{ path: 'install', component: InstallComponent },
                    //{ path: 'ui-customization', component: UiCustomizationComponent },
                    { path: 'webhook-subscriptions', component: WebhookSubscriptionComponent, data: { permission: 'Pages.Administration.WebhookSubscription' } },
                    { path: 'webhook-subscriptions-detail', component: WebhookSubscriptionDetailComponent, data: { permission: 'Pages.Administration.WebhookSubscription.Detail' } },
                    { path: 'webhook-event-detail', component: WebhookEventDetailComponent, data: { permission: 'Pages.Administration.WebhookSubscription.Detail' } },
                    { path: 'dynamic-property', component: DynamicPropertyComponent, data: { permission: 'Pages.Administration.DynamicProperties' } },
                    { path: 'dynamic-entity-property/:entityFullName', component: DynamicEntityPropertyComponent, data: { permission: 'Pages.Administration.DynamicEntityProperties' } },
                    { path: 'dynamic-entity-property-value/manage-all/:entityFullName/:rowId', component: DynamicEntityPropertyValueComponent, data: { permission: 'Pages.Administration.DynamicEntityProperties' } },
                    { path: '', redirectTo: 'hostDashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'hostDashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
