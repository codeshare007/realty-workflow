import { Component, Injector, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsTableComponent } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { UploadDocumentModalComponent } from '../modals/upload-document-modal/upload-document-modal.component';

@Component({
    selector: 'signing-forms-table',
    templateUrl: './signing-forms-table.component.html'
})
export class SigningFormsTableComponent extends AppComponentBase {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Input() signingId: string;
    filterText = '';
    items: IHasFormListDto[];
    totalCount: number;

    constructor(
        injector: Injector,
        private _router: Router,
        private _signingFormService: SigningFormServiceProxy
    ) {
        super(injector);
    }

    getAll(input: GetAllFormsInput): void {
        this._signingFormService.getAll(
            this.signingId,
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

    // edit(id) {
    //     this._router.navigate(['app/admin/signings/', this.signingId, 'form-design', id]);
    // }

    delete(id) {
        this._signingFormService.delete(id, this.signingId).subscribe(r => {
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
