import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DuplicateTransactionInput, LeadServiceProxy, RecommendedListingServiceProxy, TransactionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'duplicate-transaction-modal',
    templateUrl: './duplicate-transaction-modal.component.html'
})
export class DuplicateTransactionModalComponent extends AppComponentBase {

    @ViewChild('duplicateTransactionModal') modal: ModalDirective;
    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();
    transactionId: string;
    name: string;
    
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    public show(transactionId: string, name: string): void {
        this.name = name;
        this.transactionId = transactionId;

        this.active = true;
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        let input = new DuplicateTransactionInput();
        input.id = this.transactionId;
        input.name = this.name;
        
        this._transactionServiceProxy.duplicateTransaction(input).subscribe(transactionId => {
            this._router.navigate(['app/admin/transactions/', transactionId]);
            this.close();
        });    
    }
}
