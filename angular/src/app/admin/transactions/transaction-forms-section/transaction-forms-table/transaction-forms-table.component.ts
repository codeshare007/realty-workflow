import { Component, Injector, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsTableComponent } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransactionFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { UploadDocumentModalComponent } from '../modals/upload-document-modal/upload-document-modal.component';

@Component({
    selector: 'transaction-forms-table',
    templateUrl: './transaction-forms-table.component.html'
})
export class TransactionFormsTableComponent extends AppComponentBase {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Input() transactionId: string;
    filterText = '';
    items: IHasFormListDto[];
    totalCount: number;

    constructor(
        injector: Injector,
        private _router: Router,
        private _transactionFormService: TransactionFormServiceProxy
    ) {
        super(injector);
    }

    getAll(input: GetAllFormsInput): void {
        this._transactionFormService.getAll(
            this.transactionId,
            this.filterText,
            input.sorting,
            input.maxResultCount,
            input.skipCount,
            )
            .subscribe(result => {
                this.items = result.items;
                this.totalCount = result.totalCount;
            });
    }

    edit(id) {
        this._router.navigate(['app/admin/transactions/', this.transactionId, 'form-design', id]);
    }

    delete(id) {
        this._transactionFormService.delete(id, this.transactionId).subscribe(r => {
            this.table.getListings();
        });
    }

    public openModal(): void {
        this.uploadDocumentModal.show();
    }

    public fileSaved(event: any): void {
        this.table.getListings();
    }
}
