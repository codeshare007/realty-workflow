import { Component, OnInit, ElementRef, ViewChild, Injector, OnDestroy } from '@angular/core';
import { HostDashboardServiceProxy, GetEditionTenantStatisticsOutput } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import * as _ from 'lodash';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-edition-statistics',
  templateUrl: './widget-edition-statistics.component.html',
  styleUrls: ['./widget-edition-statistics.component.css']
})
export class WidgetEditionStatisticsComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

  @ViewChild('EditionStatisticsChart', { static: true }) editionStatisticsChart: ElementRef;

  selectedDateRange: moment.Moment[] = [moment().add(-7, 'days').startOf('day'), moment().endOf('day')];

  editionStatisticsHasData = false;
  editionStatisticsData;

  constructor(
    injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.subDateRangeFilter();
    this.runDelayed(this.showChart);
  }

  showChart = () => {
    this._hostDashboardServiceProxy.getEditionTenantStatistics(this.selectedDateRange[0], this.selectedDateRange[1])
      .subscribe((editionTenantStatistics) => {
        this.editionStatisticsData = this.normalizeEditionStatisticsData(editionTenantStatistics);
        this.editionStatisticsHasData = _.filter(this.editionStatisticsData, data => data.value > 0).length > 0;
      });
  }

  normalizeEditionStatisticsData(data: GetEditionTenantStatisticsOutput): Array<any> {
    if (!data || !data.editionStatistics || data.editionStatistics.length === 0) {
      return [];
    }

    const chartData = new Array(data.editionStatistics.length);

    for (let i = 0; i < data.editionStatistics.length; i++) {
      chartData[i] = {
        name: data.editionStatistics[i].label,
        value: data.editionStatistics[i].value
      };
    }

    return chartData;
  }

  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }

    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.showChart);
  }

  subDateRangeFilter() {
    abp.event.on('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
  }

  unSubDateRangeFilter() {
    abp.event.off('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
  }

  ngOnDestroy(): void {
    this.unSubDateRangeFilter();
  }
}
