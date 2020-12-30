import { Injectable, OnInit } from '@angular/core';
import { WidgetViewDefinition, WidgetFilterViewDefinition } from './definitions';
import { DashboardCustomizationConst } from './DashboardCustomizationConsts';
import { WidgetGeneralStatsComponent } from './widgets/widget-general-stats/widget-general-stats.component';
import { WidgetDailySalesComponent } from './widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetProfitShareComponent } from './widgets/widget-profit-share/widget-profit-share.component';
import { WidgetMemberActivityComponent } from './widgets/widget-member-activity/widget-member-activity.component';
import { WidgetRegionalStatsComponent } from './widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetIncomeStatisticsComponent } from './widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetRecentTenantsComponent } from './widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetEditionStatisticsComponent } from './widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetHostTopStatsComponent } from './widgets/widget-host-top-stats/widget-host-top-stats.component';
import { FilterDateRangePickerComponent } from './filters/filter-date-range-picker/filter-date-range-picker.component';
import { WidgetTopStatsComponent } from './widgets/widget-top-stats/widget-top-stats.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardViewConfigurationService {
  public WidgetViewDefinitions: WidgetViewDefinition[] = [];
  public widgetFilterDefinitions: WidgetFilterViewDefinition[] = [];

  constructor(
  ) {
    this.initializeConfiguration();
  }

  private initializeConfiguration() {
    let filterDateRangePicker = new WidgetFilterViewDefinition(
      DashboardCustomizationConst.filters.filterDateRangePicker,
      FilterDateRangePickerComponent
    );
     //add your filters here
    this.widgetFilterDefinitions.push(filterDateRangePicker);

    let generalStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.generalStats,
      WidgetGeneralStatsComponent,
      6,
      4
    );

    let dailySales = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.dailySales,
      WidgetDailySalesComponent,
    );

    let profitShare = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.profitShare,
      WidgetProfitShareComponent
    );

    let memberActivity = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.memberActivity,
      WidgetMemberActivityComponent,
    );

    let regionalStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.regionalStats,
      WidgetRegionalStatsComponent
    );

    let salesSummary = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.salesSummary,
      WidgetSalesSummaryComponent,
    );

    let topStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.topStats,
      WidgetTopStatsComponent,
    );
    //add your tenant side widgets here

    let incomeStatistics = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.incomeStatistics,
      WidgetIncomeStatisticsComponent,
    );

    let editionStatistics = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.editionStatistics,
      WidgetEditionStatisticsComponent,
    );

    let recentTenants = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.recentTenants,
      WidgetRecentTenantsComponent,
    );

    let subscriptionExpiringTenants = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.subscriptionExpiringTenants,
      WidgetSubscriptionExpiringTenantsComponent
    );

    let hostTopStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.topStats,
      WidgetHostTopStatsComponent,
    );
   //add your host side widgets here

    this.WidgetViewDefinitions.push(generalStats);
    this.WidgetViewDefinitions.push(dailySales);
    this.WidgetViewDefinitions.push(profitShare);
    this.WidgetViewDefinitions.push(memberActivity);
    this.WidgetViewDefinitions.push(regionalStats);
    this.WidgetViewDefinitions.push(salesSummary);
    this.WidgetViewDefinitions.push(topStats);
    this.WidgetViewDefinitions.push(incomeStatistics);
    this.WidgetViewDefinitions.push(editionStatistics);
    this.WidgetViewDefinitions.push(recentTenants);
    this.WidgetViewDefinitions.push(subscriptionExpiringTenants);
    this.WidgetViewDefinitions.push(hostTopStats);
  }
}
