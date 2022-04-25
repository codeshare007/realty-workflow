import { Component, Injector, Input, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { CreateTransactionAttachmentModalComponent } from "./modals/create-transaction-attachment-modal.component";
import { TransactionAttachmentsTableComponent } from "./tables/transaction-attachments-table.component";

@Component({
    selector: 'attachments',
    templateUrl: './transaction-attachments.component.html'
})
export class TransactionAttachmentsComponent extends AppComponentBase {
    
    @ViewChild('createTransactionAttachmentModal', { static: true}) modal: CreateTransactionAttachmentModalComponent;
    @ViewChild('transactionAttachmentsTable', { static: true }) table: TransactionAttachmentsTableComponent;

    @Input() transactionId: string;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    public onModalSaved(event: boolean) {
        this.table.getAttachments();
    }

    public createAttachment() {
        this.modal.show(this.transactionId);
    }
}
