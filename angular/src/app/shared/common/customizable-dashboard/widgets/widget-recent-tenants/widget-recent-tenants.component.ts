import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { HostDashboardServiceProxy, GetRecentTenantsOutput } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-recent-tenants',
  templateUrl: './widget-recent-tenants.component.html',
  styleUrls: ['./widget-recent-tenants.component.css']
})
export class WidgetRecentTenantsComponent extends WidgetComponentBaseComponent {
  @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy) {
    super(injector);
    this.loadRecentTenantsData();
  }

  loading = true;

  recentTenantsData: GetRecentTenantsOutput;

  loadRecentTenantsData() {
    this._hostDashboardServiceProxy.getRecentTenantsData().subscribe((data) => {
      this.recentTenantsData = data;
      this.loading = false;
    });
  }

  gotoAllRecentTenants(): void {
    window.open(abp.appPath + 'app/admin/tenants?' +
      'creationDateStart=' + encodeURIComponent(this.recentTenantsData.tenantCreationStartDate.format()));
  }

}
