import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloadOriginalDocumentInput, EntityDtoOfGuid, FileDto, LibraryFormServiceProxy, LibraryServiceProxy, PagedResultDtoOfLibraryFormListDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetAllFormsInput, IHasFormListDto } from '../../models/table-documents.model';
import { FormsTableComponent, FormsTableOptions } from '../forms-table.component';

@Component({
    selector: 'select-form-library-modal',
    templateUrl: './select-form-library-modal.component.html'
})
export class SelectFormLibraryModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectMany: EventEmitter<string[]> = new EventEmitter<string[]>();
    @Input() libraryId: string;

    active = false;
    saving = false;
    items: IHasFormListDto[];
    totalCount: number;
    options = new FormsTableOptions(false, false, false, true, true);

    constructor(
        injector: Injector,
        private _libraryService: LibraryServiceProxy,
        private _libraryFormService: LibraryFormServiceProxy,
        private _fileDownloadService: FileDownloadService,
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

    public selectForm(libraryFormId: string): void {
        this.onSelect.emit(libraryFormId);
        this.close();
    }

    public selectForms(libraryFormIds: string[]): void {
        this.onSelectMany.emit(libraryFormIds);
        this.close();
    }

    public onDownloadOriginalDocument(item: IHasFormListDto) {
        const input = new DownloadOriginalDocumentInput({
            id: this.libraryId,
            form: new EntityDtoOfGuid({ id: item.form.id })
        });

        this._libraryService.downloadOriginalDocument(input)
            .subscribe((result: FileDto) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    public getAll(input: GetAllFormsInput): void {
        this._libraryFormService.getAll(
            this.libraryId,
            undefined,
            input.sorting,
            input.maxResultCount,
            input.skipCount,
        )
            .subscribe((result: PagedResultDtoOfLibraryFormListDto) => {
                this.items = result.items;
                this.totalCount = result.totalCount;
            });
    }
}
