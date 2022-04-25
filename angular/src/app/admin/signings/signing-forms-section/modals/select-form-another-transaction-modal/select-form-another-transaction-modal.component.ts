import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { FormsTableComponent, FormsTableOptions } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddTransactionFromInput, EntityDtoOfGuid, TransactionFormServiceProxy, TransactionSearchDto } from '@shared/service-proxies/service-proxies';
import { isNull } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'select-form-another-transaction-modal',
    templateUrl: './select-form-another-transaction-modal.component.html'
})
export class SelectFormAnotherTransactionModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Output() onSelect: EventEmitter<AddTransactionFromInput> = new EventEmitter<AddTransactionFromInput>();
    transaction: TransactionSearchDto;

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
        this.transaction = undefined;
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public selectForm(transactionFormId: string) {
        var input = new AddTransactionFromInput();
        input.form = new EntityDtoOfGuid({ id: transactionFormId });
        input.transactionId = this.transaction.id;

        this.onSelect.emit(input);
        this.close();
    }

    public selectForms(transactionFormIds: string[]): void {
        transactionFormIds.forEach(transactionFormId => {
            var input = new AddTransactionFromInput();
            input.form = new EntityDtoOfGuid({ id: transactionFormId });
            input.transactionId = this.transaction.id;
            this.onSelect.emit(input);
        });

        this.close();
    }

    getForms() {
        setTimeout(() => this.table.getListings(), 0);
    }

    getAll(input: GetAllFormsInput): void {
        if (isNull(this.transaction) || isNull(this.transaction.id)) { return; }

        this._transactionFormServiceProxy.getAll(
            this.transaction.id,
            undefined,
            input.sorting,
            input.maxResultCount,
            input.skipCount,
        )
            .subscribe(result => {
                this.items = result.items;
                this.totalCount = result.totalCount;
            });
    }
}
