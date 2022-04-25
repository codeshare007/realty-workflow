import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { FormsTableComponent, FormsTableOptions } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PagedResultDtoOfTransactionFormListDto, TransactionFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { isNull } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'select-form-transaction-modal',
    templateUrl: './select-form-transaction-modal.component.html'
})
export class SelectFormTransactionModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectMany: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Input() transactionId: string;

    active = false;
    saving = false;
    items: IHasFormListDto[];
    totalCount: number;
    options = new FormsTableOptions(false, false, false, true, true);

    constructor(
        injector: Injector,
        private _transactionFormServiceProxy: TransactionFormServiceProxy,
    ) {
        super(injector);
    }

    public show(): void {
        this.active = true;
        this.table.getListings();
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public selectForm(transactionFormId: string) {
        this.onSelect.emit(transactionFormId);
        this.close();
    }

    public getAll(input: GetAllFormsInput): void {
        if (isNull(this.transactionId)) { return; }

        this._transactionFormServiceProxy.getAll(
            this.transactionId,
            undefined,
            input.sorting,
            input.maxResultCount,
            input.skipCount,
        )
            .subscribe((result: PagedResultDtoOfTransactionFormListDto) => {
                this.items = result.items;
                this.totalCount = result.totalCount;
            });
    }

    public selectForms(transactionFormIds: string[]): void {
        this.onSelectMany.emit(transactionFormIds);
        this.close();
    }
}
