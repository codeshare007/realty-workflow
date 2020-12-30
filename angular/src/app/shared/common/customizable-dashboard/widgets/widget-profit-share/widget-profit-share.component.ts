import { Component, OnInit, Injector } from '@angular/core';
import { TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';

class ProfitSharePieChart extends DashboardChartBase {

  chartData: any[] = [];
  scheme: any = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#00c5dc', '#ffb822', '#716aca'
    ]
  };

  constructor(private _dashboardService: TenantDashboardServiceProxy) {
    super();
  }

  init(data: number[]) {

    let formattedData = [];
    for (let i = 0; i < data.length; i++) {
      formattedData.push({
        'name': this.getChartItemName(i),
        'value': data[i]
      });
    }

    this.chartData = formattedData;
  }

  getChartItemName(index: number) {
    if (index === 0) {
      return 'Product Sales';
    }

    if (index === 1) {
      return 'Online Courses';
    }

    if (index === 2) {
      return 'Custom Development';
    }

    return 'Other';
  }

  reload() {
    this.showLoading();
    this._dashboardService.getProfitShare().subscribe(data => {
      this.init(data.profitShares);
      this.hideLoading();
    });
  }
}

@Component({
  selector: 'app-widget-profit-share',
  templateUrl: './widget-profit-share.component.html',
  styleUrls: ['./widget-profit-share.component.css']
})
export class WidgetProfitShareComponent extends WidgetComponentBaseComponent implements OnInit {

  profitSharePieChart: ProfitSharePieChart;

  constructor(injector: Injector,
    private _dashboardService: TenantDashboardServiceProxy) {
    super(injector);
    this.profitSharePieChart = new ProfitSharePieChart(this._dashboardService);
  }

  ngOnInit() {
    this.profitSharePieChart.reload();
  }
}
