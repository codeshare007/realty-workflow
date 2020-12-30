import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WebhookSendAttemptServiceProxy, WebhookSubscription, WebhookEventServiceProxy, WebhookEvent } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './webhook-event-detail.component.html',
    styleUrls: ['./webhook-event-detail.component.css'],
    animations: [appModuleAnimation()]
})
export class WebhookEventDetailComponent extends AppComponentBase implements OnInit {
    @ViewChild('detailModal', { static: true }) detailModal: ModalDirective;
    subscription: WebhookSubscription;
    loading = true;
    webhookEventId: string;
    webhookEvent: WebhookEvent;

    maxDataLength = 300;
    listMaxResponseLength = 100;
    detailModalText = '';

    constructor(
        injector: Injector,
        private _webhookEventService: WebhookEventServiceProxy,
        private _webhookSendAttemptService: WebhookSendAttemptServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.webhookEventId = this._activatedRoute.snapshot.queryParams['id'];
        this.getDetail();
    }

    getSendAttempts(event?: any): void {
        this.primengTableHelper.showLoadingIndicator();

        this._webhookSendAttemptService.getAllSendAttemptsOfWebhookEvent(
            this.webhookEventId
        )
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getDetail(): void {
        this._webhookEventService.get(this.webhookEventId)
            .subscribe((webhookEvent) => {
                this.webhookEvent = webhookEvent;
                this.loading = false;
            });
    }

    goToWebhookSubscriptionDetail(subscriptionId: string): void {
        this._router.navigate(['app/admin/webhook-subscriptions-detail'],
            {
                queryParams: {
                    id: subscriptionId,
                }
            });
    }

    resend(id: string): void {
        this.message.confirm(
            this.l('WebhookEventWillBeSendWithSameParameters'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.showMainSpinner();
                    this._webhookSendAttemptService.resend(id).subscribe(() => {
                        abp.notify.success(this.l('WebhookSendAttemptInQueue'));
                        this.hideMainSpinner();
                    }, () => {
                        this.hideMainSpinner();
                    });
                }
            }
        );
    }

    showDetailModal(text): void {
        this.detailModalText = text;
        this.detailModal.show();
    }

    showMoreData(): void {
        document.getElementById('dataDots').classList.add('d-none');
        document.getElementById('dataShowMoreBtn').classList.add('d-none');
        document.getElementById('dataMore').classList.remove('d-none');
    }
}
