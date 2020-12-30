import {Component, Injector, Output, EventEmitter, ViewChild} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    WebhookSubscriptionServiceProxy,
    WebhookSubscription,
    NameValueOfString
} from '@shared/service-proxies/service-proxies';
import {Observable} from 'rxjs';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {KeyValueListManagerComponent} from '@app/shared/common/key-value-list-manager/key-value-list-manager.component';

@Component({
    selector: 'create-or-edit-webhook-subscription',
    templateUrl: './create-or-edit-webhook-subscription-modal.component.html',
    styleUrls: ['./create-or-edit-webhook-subscription-modal.component.css']
})
export class CreateOrEditWebhookSubscriptionModalComponent extends AppComponentBase {
    @ViewChild('headerKeyValueManager') headerKeyValueManager: KeyValueListManagerComponent;
    @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    objectKeys = Object.keys;

    webhookSubscription: WebhookSubscription = new WebhookSubscription();
    webhookSubscriptionId?: string;

    allWebhooks: NameValueOfString[];

    filteredWebhooks: NameValueOfString[];

    active = false;
    saving = false;

    webhooks: NameValueOfString[] = new Array<NameValueOfString>();
    headers: { key: string, value: string }[] = [];

    constructor(
        injector: Injector,
        private _webhookSubscriptionService: WebhookSubscriptionServiceProxy
    ) {
        super(injector);
        this.getAllWebhooks();
    }

    show(subscriptionId?: string): void {
        this.webhookSubscriptionId = subscriptionId;
        if (!subscriptionId) {
            this.active = true;
            this.modal.show();
            return;
        }
        this.showMainSpinner();
        this._webhookSubscriptionService.getSubscription(subscriptionId)
            .subscribe(result => {
                this.webhookSubscription = result;
                this.webhooks = this.webhookSubscription.webhooks.map(wh =>
                    new NameValueOfString({
                        name: wh,
                        value: wh
                    }));

                let keys = Object.keys(this.webhookSubscription.headers);
                if (this.webhookSubscription.headers && keys.length > 0) {
                    this.headers = keys.map(x => {
                        return {
                            key: x,
                            value: this.webhookSubscription.headers[x]
                        };
                    });
                }

                this.hideMainSpinner();
                this.active = true;
                this.modal.show();
            }, (e) => {
                this.hideMainSpinner();
            });
    }

    save(): void {
        this.webhookSubscription.webhooks = this.webhooks.map(wh => wh.name);
        if (!this.webhookSubscription.headers) {
            this.webhookSubscription.headers = {};
        }

        this.headerKeyValueManager.getItems().forEach(item => {
            this.webhookSubscription.headers[item.key] = item.value;
        });

        let observable: Observable<void>;
        if (!this.webhookSubscriptionId) {
            observable = this._webhookSubscriptionService.addSubscription(this.webhookSubscription);
        } else {
            observable = this._webhookSubscriptionService.updateSubscription(this.webhookSubscription);
        }

        observable.subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.hideMainSpinner();
            this.modalSave.emit(null);
            this.close();
        }, (e) => {
            this.hideMainSpinner();
        });
    }

    getAllWebhooks(): void {
        this._webhookSubscriptionService.getAllAvailableWebhooks().subscribe((webhooks) => {
            this.allWebhooks = webhooks.items.map(wh =>
                new NameValueOfString({
                    name: wh.name,
                    value: wh.name
                }));
        });
    }

    filterWebhooks(event) {
        this.filteredWebhooks = this.allWebhooks
            .filter(item =>
                item.name.toLowerCase().includes(event.query.toLowerCase()) ||
                item.value.toLowerCase().includes(event.query.toLowerCase())
            );
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    removeHeader(headerKey: string) {
        let item = document.getElementById('additional-header-' + headerKey);
        item.remove();
        delete this.webhookSubscription.headers[headerKey];
    }
}
