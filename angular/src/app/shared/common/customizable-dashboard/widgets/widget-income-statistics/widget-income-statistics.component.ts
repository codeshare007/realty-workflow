import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { ChartDateInterval, HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import * as _ from 'lodash';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-income-statistics',
  templateUrl: './widget-income-statistics.component.html',
  styleUrls: ['./widget-income-statistics.component.css']
})
export class WidgetIncomeStatisticsComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

  selectedIncomeStatisticsDateInterval = ChartDateInterval.Daily;
  loadingIncomeStatistics = true;

  selectedDateRange: moment.Moment[] = [moment().add(-7, 'days').startOf('day'), moment().endOf('day')];
  incomeStatisticsData: any = [];
  incomeStatisticsHasData = false;
  appIncomeStatisticsDateInterval = ChartDateInterval;

  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.subDateRangeFilter();
    this.runDelayed(this.loadIncomeStatisticsData);
  }

  incomeStatisticsDateIntervalChange(interval: number) {
    if (this.selectedIncomeStatisticsDateInterval === interval) {
      return;
    }

    this.selectedIncomeStatisticsDateInterval = interval;
    this.loadIncomeStatisticsData();
  }

  loadIncomeStatisticsData = () => {
    this.loadingIncomeStatistics = true;
    this._hostDashboardServiceProxy.getIncomeStatistics(
      this.selectedIncomeStatisticsDateInterval,
      moment(this.selectedDateRange[0]),
      moment(this.selectedDateRange[1]))
      .subscribe(result => {
        this.incomeStatisticsData = this.normalizeIncomeStatisticsData(result.incomeStatistics);
        this.incomeStatisticsHasData = _.filter(this.incomeStatisticsData[0].series, data => data.value > 0).length > 0;
        this.loadingIncomeStatistics = false;
      });
  }

  normalizeIncomeStatisticsData(data): any {
    const chartData = [];
    for (let i = 0; i < data.length; i++) {
      chartData.push({
        'name': moment(moment(data[i].date).utc().valueOf()).format('L'),
        'value': data[i].amount
      });
    }

    return [{
      name: '',
      series: chartData
    }];
  }

  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }

    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.loadIncomeStatisticsData);
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
