import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WebhookSubscriptionServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { CreateOrEditWebhookSubscriptionModalComponent } from './create-or-edit-webhook-subscription-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';

@Component({
  templateUrl: './webhook-subscription.component.html',
  styleUrls: ['./webhook-subscription.component.css'],
  animations: [appModuleAnimation()]
})
export class WebhookSubscriptionComponent extends AppComponentBase {

  @ViewChild('createOrEditWebhookSubscriptionModal', { static: true }) createOrEditWebhookSubscriptionModal: CreateOrEditWebhookSubscriptionModalComponent;

  constructor(
    injector: Injector,
    private _webhookSubscriptionService: WebhookSubscriptionServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  getSubscriptions(event?: any): void {
    this.primengTableHelper.showLoadingIndicator();

    this._webhookSubscriptionService.getAllSubscriptions()
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.items.length;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  createSubscription(): void {
    this.createOrEditWebhookSubscriptionModal.show();
  }

  goToSubscriptionDetail(subscriptionId: string): void {
    this._router.navigate(['app/admin/webhook-subscriptions-detail'],
      {
        queryParams: {
          id: subscriptionId,
        }
      });
  }
}
