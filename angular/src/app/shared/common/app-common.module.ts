import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { SubHeaderComponent } from '@app/shared/common/sub-header/sub-header.component';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { RealtyCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridsterModule } from 'angular-gridster2';
import { CountoModule } from 'angular2-counto';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { ClickOutsideDirective } from './directives/dropdown.directive';
import { UiToolTipDirective } from './directives/tool-tip.directive';
import { UiDragDropDirective } from './directives/ui-drag-drop.directive';
import { UiToolTipComponent } from './directives/ui-tool-tip/ui-tool-tip.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { AutocompleteTransactionInputComponent } from './input-types/autocomplete-transaction-input.component/autocomplete-transaction-input.component';
import { AutocompleteUserInputComponent } from './input-types/autocomplete-user-input.component/autocomplete-user-input.component';
import { CheckboxInputTypeComponent } from './input-types/checkbox-input-type/checkbox-input-type.component';
import { ComboboxInputTypeComponent } from './input-types/combobox-input-type/combobox-input-type.component';
import { MultipleSelectComboboxInputTypeComponent } from './input-types/multiple-select-combobox-input-type/multiple-select-combobox-input-type.component';
import { SingleLineStringInputTypeComponent } from './input-types/single-line-string-input-type/single-line-string-input-type.component';
import { UserComboComponent } from './input-types/user-combo.component';
import { KeyValueListManagerComponent } from './key-value-list-manager/key-value-list-manager.component';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { PasswordInputWithShowButtonComponent } from './password-input-with-show-button/password-input-with-show-button.component';
import { FormControlClassPipe } from './pipes/form-control-class.pipe';
import { FormControlIconClassPipe } from './pipes/form-control-icon-class.pipe';
import { FormControlParticipantNamePipe } from './pipes/form-control-participant-name.pipe';
import { FormControlTypePipe } from './pipes/form-control-type.pipe';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        RealtyCommonModule,
        TableModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        AppBsModalModule,
        AutoCompleteModule
    ],
    declarations: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        MultipleSelectComboboxInputTypeComponent,
        PasswordInputWithShowButtonComponent,
        KeyValueListManagerComponent,
        SubHeaderComponent,
        UiToolTipComponent,
        AutocompleteUserInputComponent,
        AutocompleteTransactionInputComponent,
        UserComboComponent,

        ClickOutsideDirective,
        UiDragDropDirective,
        UiToolTipDirective,

        FormControlTypePipe,
        FormControlClassPipe,
        FormControlIconClassPipe,
        FormControlParticipantNamePipe,
    ],
    exports: [
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        NgxChartsModule,
        PasswordInputWithShowButtonComponent,
        KeyValueListManagerComponent,
        SubHeaderComponent,
        AutocompleteUserInputComponent,
        AutocompleteTransactionInputComponent,
        UserComboComponent,

        ClickOutsideDirective,
        UiDragDropDirective,
        UiToolTipDirective,

        FormControlTypePipe,
        FormControlClassPipe,
        FormControlIconClassPipe,
        FormControlParticipantNamePipe,
    ],
    providers: [
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig }
    ],

    entryComponents: [
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        SingleLineStringInputTypeComponent,
        ComboboxInputTypeComponent,
        CheckboxInputTypeComponent,
        MultipleSelectComboboxInputTypeComponent,
        UiToolTipComponent,
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
