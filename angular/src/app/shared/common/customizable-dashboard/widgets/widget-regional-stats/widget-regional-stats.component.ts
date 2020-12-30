import { Component, OnInit, Injector } from '@angular/core';
import { DashboardChartBase } from '../dashboard-chart-base';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { curveBasis } from 'd3-shape';
import { WidgetComponentBaseComponent } from '../widget-component-base';

class RegionalStatsTable extends DashboardChartBase {
  stats: Array<any>;
  colors = ['#00c5dc', '#f4516c', '#34bfa3', '#ffb822'];
  customColors = [
    { name: '1', value: '#00c5dc' },
    { name: '2', value: '#f4516c' },
    { name: '3', value: '#34bfa3' },
    { name: '4', value: '#ffb822' },
    { name: '5', value: '#00c5dc' }
  ];

  curve: any = curveBasis;

  constructor(private _dashboardService: TenantDashboardServiceProxy) {
    super();
  }

  init() {
    this.reload();
  }

  formatData(): any {
    for (let j = 0; j < this.stats.length; j++) {
      let stat = this.stats[j];

      let series = [];
      for (let i = 0; i < stat.change.length; i++) {
        series.push({
          name: i + 1,
          value: stat.change[i]
        });
      }

      stat.changeData = [
        {
          'name': j + 1,
          'series': series
        }
      ];

    }
  }

  reload() {
    this.showLoading();
    this._dashboardService
      .getRegionalStats()
      .subscribe(result => {
        this.stats = result.stats;
        this.formatData();
        this.hideLoading();
      });
  }
}

@Component({
  selector: 'app-widget-regional-stats',
  templateUrl: './widget-regional-stats.component.html',
  styleUrls: ['./widget-regional-stats.component.css']
})
export class WidgetRegionalStatsComponent extends WidgetComponentBaseComponent implements OnInit {

  regionalStatsTable: RegionalStatsTable;

  constructor(injector: Injector,
    private _dashboardService: TenantDashboardServiceProxy) {
    super(injector);
    this.regionalStatsTable = new RegionalStatsTable(this._dashboardService);
  }

  ngOnInit() {
    this.regionalStatsTable.init();
  }
}
