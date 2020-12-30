import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { HostDashboardServiceProxy, GetExpiringTenantsOutput } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-subscription-expiring-tenants',
  templateUrl: './widget-subscription-expiring-tenants.component.html',
  styleUrls: ['./widget-subscription-expiring-tenants.component.css']
})
export class WidgetSubscriptionExpiringTenantsComponent extends WidgetComponentBaseComponent implements OnInit {

  @ViewChild('ExpiringTenantsTable', { static: true }) expiringTenantsTable: Table;

  dataLoading = true;
  expiringTenantsData: GetExpiringTenantsOutput;

  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._hostDashboardServiceProxy.getSubscriptionExpiringTenantsData().subscribe((data) => {
      this.expiringTenantsData = data;
      this.dataLoading = false;
    });
  }

  gotoAllExpiringTenants(): void {
    const url = abp.appPath +
      'app/admin/tenants?' +
      'subscriptionEndDateStart=' +
      encodeURIComponent(this.expiringTenantsData.subscriptionEndDateStart.format()) +
      '&' +
      'subscriptionEndDateEnd=' +
      encodeURIComponent(this.expiringTenantsData.subscriptionEndDateEnd.format());

    window.open(url);
  }
}
