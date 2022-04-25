import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, TransactionParticipantServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Paginator, Table } from 'primeng';

@Component({
    selector: 'select-transaction-participant-modal',
    templateUrl: './select-transaction-participant-modal.component.html',
})
export class SelectTransactionParticipantModalComponent extends AppComponentBase {

    @ViewChild('selectTransactionParticipantModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;

    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() selectParticipant = new EventEmitter<string>();
    @Output() onSelectMany: EventEmitter<string[]> = new EventEmitter<string[]>();

    transactionId: string;
    selectedIds: string[];
    active = false;
    saving = false;

    get isAllovedMulty(): boolean {
        return this.selectedIds && this.selectedIds.length > 1;
    }

    constructor(
        injector: Injector,
        private _transactionParticipantServiceProxy: TransactionParticipantServiceProxy
    ) {
        super(injector);
    }

    show(transactionId: string): void {
        if (!transactionId) {
            this.close();
        }

        this.transactionId = transactionId;
        this.getParticipants();
        this.modal.show();
    }

    getParticipants(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._transactionParticipantServiceProxy.getAll(
            undefined,
            this.transactionId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    public selectItem(record: ContactListDto) {
        this.selectParticipant.emit(record.id);
        this.close();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public onSelectionToggle(record: ContactListDto) {
        this.selectedIds = this.selectedIds || new Array();

        if (record['isChecked'] === true) {
            const index = this.selectedIds.indexOf(record.id, 0);
            if (index > -1) {
                this.selectedIds.splice(index, 1);
            }
        } else {
            this.selectedIds.push(record.id);
        }

        record['isChecked'] = !record['isChecked'];
    }

    public selectMulti(): void {
        if (this.selectedIds && this.selectedIds.length > 0) {
            this.onSelectMany.emit(this.selectedIds);
            this.selectedIds = [];
            this.close();
        }
    }
}
