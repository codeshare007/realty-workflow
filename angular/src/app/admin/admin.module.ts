import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { CreateOrEditDynamicPropertyModalComponent } from '@app/admin/dynamic-properties/create-or-edit-dynamic-property-modal.component';
import { CreateDynamicEntityPropertyModalComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/create-dynamic-entity-property-modal.component';
import { DynamicEntityPropertyListComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/dynamic-entity-property-list.component';
import { DynamicEntityPropertyComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/dynamic-entity-property.component';
import { DynamicEntityPropertyValueComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/value/dynamic-entity-property-value.component';
import { ManageValuesModalComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/value/manage-values-modal.component';
import { ManagerComponent } from '@app/admin/dynamic-properties/dynamic-entity-properties/value/manager.component';
import { DynamicPropertyValueModalComponent } from '@app/admin/dynamic-properties/dynamic-property-value/dynamic-property-value-modal.component';
import { DynamicPropertyComponent } from '@app/admin/dynamic-properties/dynamic-property.component';
import { SelectAnEntityModalComponent } from '@app/admin/dynamic-properties/select-an-entity-modal.component';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { SharedModalsModule } from '@app/shared/components/modals/shared-modals.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { CoreModule } from '@metronic/app/core/core.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountoModule } from 'angular2-counto';
import { TextMaskModule } from 'angular2-text-mask';
import { AddMemberModalComponent } from 'app/admin/organization-units/add-member-modal.component';
import { AddRoleModalComponent } from 'app/admin/organization-units/add-role-modal.component';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ImageCropperModule } from 'ngx-image-cropper';
// Metronic
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgxTagsInputModule } from 'ngx-tags-input';
import { TreeDragDropService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { CommunicationsComponent } from './communications/communications.component';
import { CommsComposeMessageComponent } from './communications/components/comms-compose-message/comms-compose-message.component';
import { CommsInboxAsideComponent } from './communications/components/comms-inbox-aside/comms-inbox-aside.component';
import { CommsInboxMessageViewComponent } from './communications/components/comms-inbox-message-view/comms-inbox-message-view.component';
import { CommsInboxViewComponent } from './communications/components/comms-inbox-view/comms-inbox-view.component';
import { CommsSettingsModalComponent } from './communications/components/comms-settings-modal/comms-settings-modal.component';
import { ContactsPageComponent } from './contacts/page/contacts-page.component';
import { ContactsTableComponent } from './contacts/table/contacts-table.component';
import { CustomersPageComponent } from './customers/customers-page.component';
import { ListingPage } from './customers/listing-page/listing-page.component';
import { ManageCustomersComponent } from './customers/manage-customers.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { DemoUiDateTimeComponent } from './demo-ui-components/demo-ui-date-time.component';
import { DemoUiEditorComponent } from './demo-ui-components/demo-ui-editor.component';
import { DemoUiFileUploadComponent } from './demo-ui-components/demo-ui-file-upload.component';
import { DemoUiInputMaskComponent } from './demo-ui-components/demo-ui-input-mask.component';
import { DemoUiSelectionComponent } from './demo-ui-components/demo-ui-selection.component';
import { CreateEditionModalComponent } from './editions/create-edition-modal.component';
import { EditEditionModalComponent } from './editions/edit-edition-modal.component';
import { EditionsComponent } from './editions/editions.component';
import { MoveTenantsToAnotherEditionModalComponent } from './editions/move-tenants-to-another-edition-modal.component';
import { InstallComponent } from './install/install.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { LeadListingDetailModule } from './leads/components/lead-listing-detail/lead-listing-detail.module';
import { CreateLeadModalComponent } from './leads/components/lead-listing-detail/modals/create-lead-modal/create-lead-modal.component';
import { SendRecommendedListingsModalComponent } from './leads/components/lead-listing-detail/modals/send-recommended-listings-modal/send-recommended-listings-modal.component';
import { LeadContactsComponent } from './leads/lead-contacts-section/lead-contacts/lead-contacts.component';
import { LeadDetailComponent } from './leads/lead-detail/lead-detail.page.component';
import { LeadGeneralSectionComponent } from './leads/lead-detail/lead-general-info-section/lead-general-info-section.component';
import { LeadGeneralInfoSearchFilterComponent } from './leads/lead-detail/lead-general-info-section/search-filter/lead-general-info-search-filter.component';
import { LeadGeneralInfoCitiesListComponent } from './leads/lead-detail/lead-general-info-section/search-filter/modals/cities/cities-list/lead-general-info-cities-list.component';
import { LeadGeneralInfoCitiesModalComponent } from './leads/lead-detail/lead-general-info-section/search-filter/modals/cities/lead-general-info-cities-modal.component';
import { LeadsComponent } from './leads/leads.component';
import { EmailListingsModalComponent } from './leads/recommended-listings/modals/email-listings-modal/email-listings-modal.component';
import { LeadToTransactionModalComponent } from './leads/recommended-listings/modals/lead-to-transaction-modal/lead-to-transaction-modal.component';
import { RecommendedListingsComponent } from './leads/recommended-listings/recommended-listings.component';
import { SearchListingComponent } from './leads/search-listings/search-listing.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitRolesComponent } from './organization-units/organization-unit-roles.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { GeneralComboStringComponent } from './shared/general-combo-string.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { PermissionTreeModalComponent } from './shared/permission-tree-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { SharedGeneralComboModule } from './signings/shared/shared-general-combo.module';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { TenantsComponent } from './tenants/tenants.component';
import { DefaultThemeUiSettingsComponent } from './ui-customization/default-theme-ui-settings.component';
import { Theme10ThemeUiSettingsComponent } from './ui-customization/theme10-theme-ui-settings.component';
import { Theme11ThemeUiSettingsComponent } from './ui-customization/theme11-theme-ui-settings.component';
import { Theme2ThemeUiSettingsComponent } from './ui-customization/theme2-theme-ui-settings.component';
import { Theme3ThemeUiSettingsComponent } from './ui-customization/theme3-theme-ui-settings.component';
import { Theme4ThemeUiSettingsComponent } from './ui-customization/theme4-theme-ui-settings.component';
import { Theme5ThemeUiSettingsComponent } from './ui-customization/theme5-theme-ui-settings.component';
import { Theme6ThemeUiSettingsComponent } from './ui-customization/theme6-theme-ui-settings.component';
import { Theme7ThemeUiSettingsComponent } from './ui-customization/theme7-theme-ui-settings.component';
import { Theme8ThemeUiSettingsComponent } from './ui-customization/theme8-theme-ui-settings.component';
import { Theme9ThemeUiSettingsComponent } from './ui-customization/theme9-theme-ui-settings.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { UsersComponent } from './users/users.component';
import { CreateOrEditWebhookSubscriptionModalComponent } from './webhook-subscription/create-or-edit-webhook-subscription-modal.component';
import { WebhookEventDetailComponent } from './webhook-subscription/webhook-event-detail.component';
import { WebhookSubscriptionDetailComponent } from './webhook-subscription/webhook-subscription-detail.component';
import { WebhookSubscriptionComponent } from './webhook-subscription/webhook-subscription.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        NgxChartsModule,
        CountoModule,
        TextMaskModule,
        ImageCropperModule,
        PerfectScrollbarModule,
        DropdownModule,
        AppBsModalModule,
        CoreModule,
        NgxTagsInputModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatSliderModule,
        UiComponentsModule,
        LeadListingDetailModule,
        SharedGeneralComboModule,
        SharedModalsModule,
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        OrganizationUnitsTreeComponent,
        RolesComponent,
        GeneralComboStringComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
        HostSettingsComponent,
        InstallComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateEditionModalComponent,
        EditEditionModalComponent,
        MoveTenantsToAnotherEditionModalComponent,
        LanguagesComponent,
        LanguageTextsComponent,
        CreateOrEditLanguageModalComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        CreateOrEditLanguageModalComponent,
        EditTextModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        OrganizationUnitRolesComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        InvoiceComponent,
        SubscriptionManagementComponent,
        AddMemberModalComponent,
        AddRoleModalComponent,
        DemoUiComponentsComponent,
        DemoUiDateTimeComponent,
        DemoUiSelectionComponent,
        DemoUiFileUploadComponent,
        DemoUiInputMaskComponent,
        DemoUiEditorComponent,
        UiCustomizationComponent,
        DefaultThemeUiSettingsComponent,
        Theme2ThemeUiSettingsComponent,
        Theme3ThemeUiSettingsComponent,
        Theme4ThemeUiSettingsComponent,
        Theme5ThemeUiSettingsComponent,
        Theme6ThemeUiSettingsComponent,
        Theme7ThemeUiSettingsComponent,
        Theme8ThemeUiSettingsComponent,
        Theme9ThemeUiSettingsComponent,
        Theme10ThemeUiSettingsComponent,
        Theme11ThemeUiSettingsComponent,
        PermissionTreeModalComponent,
        WebhookSubscriptionComponent,
        CreateOrEditWebhookSubscriptionModalComponent,
        WebhookSubscriptionDetailComponent,
        WebhookEventDetailComponent,
        DynamicPropertyComponent,
        CreateOrEditDynamicPropertyModalComponent,
        DynamicPropertyValueModalComponent,
        DynamicEntityPropertyComponent,
        CreateDynamicEntityPropertyModalComponent,
        DynamicEntityPropertyValueComponent,
        ManageValuesModalComponent,
        ManagerComponent,
        DynamicEntityPropertyListComponent,
        SelectAnEntityModalComponent,
        CommunicationsComponent,
        CommsInboxAsideComponent,
        CommsInboxViewComponent,
        CommsSettingsModalComponent,
        CommsComposeMessageComponent,
        CommsInboxMessageViewComponent,
        ManageCustomersComponent,
        ListingPage,
        CustomersPageComponent,
        LeadsComponent,
        LeadContactsComponent,
        CreateLeadModalComponent,
        LeadGeneralSectionComponent,
        LeadGeneralInfoSearchFilterComponent,
        LeadGeneralInfoCitiesModalComponent,
        LeadGeneralInfoCitiesListComponent,
        LeadDetailComponent,
        SendRecommendedListingsModalComponent,
        LeadToTransactionModalComponent,
        RecommendedListingsComponent,
        SearchListingComponent,
        EmailListingsModalComponent,
        ContactsPageComponent,
        ContactsTableComponent,
    ],
    exports: [
        AddMemberModalComponent,
        AddRoleModalComponent
    ],
    providers: [
        ImpersonationService,
        TreeDragDropService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
    ]
})
export class AdminModule { }
