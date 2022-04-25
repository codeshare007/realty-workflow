import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LeadServiceProxy, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'lead-to-transaction-modal',
    templateUrl: './lead-to-transaction-modal.component.html'
})
export class LeadToTransactionModalComponent extends AppComponentBase {

    @ViewChild('leadToTransactionModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();
    leadId: string;
    recommendedListingId: string;
    name: string;
    
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _leadServiceProxy: LeadServiceProxy,
        private _recommendedListingServiceProxy: RecommendedListingServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    public show(name: string, leadId: string, recommendedListingId: string): void {
        this.name = name;
        this.leadId = leadId;
        this.recommendedListingId = recommendedListingId;

        this.active = true;
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        if (this.leadId) {
            this._leadServiceProxy.createTransaction(this.name, this.leadId).subscribe(transactionId => {
                this._router.navigate(['app/admin/transactions', transactionId]);
                this.close();
            });    
        }
        else {
            this._recommendedListingServiceProxy.createTransaction(this.name, this.recommendedListingId).subscribe(transactionId => {
                this._router.navigate(['app/admin/transactions', transactionId]);
                this.close();
            });
        }
    }
}
