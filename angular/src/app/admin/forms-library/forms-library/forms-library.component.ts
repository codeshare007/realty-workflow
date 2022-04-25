import { AfterViewInit, Component, Injector, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { DocumentViewService } from '@app/shared/components/forms-library/form-library-document/components/document-view/services/document-view.service';
import { FormsTableComponent, FormsTableOptions } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { DocumentNotification } from '@app/shared/layout/notifications/DocumentNotificationHelper';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloadOriginalDocumentInput, EntityDtoOfGuid, LibraryFormServiceProxy, LibraryServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UploadDocumentModalComponent } from './modals/upload-local-move-photo/upload-document-modal.component';

@Component({
    templateUrl: './forms-library.component.html',
    animations: [accountModuleAnimation()],
})
export class FormsLibraryComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    libraryId: string;
    libraries: SelectListItem[];
    items: IHasFormListDto[];
    totalCount: number;
    options = new FormsTableOptions(true, true, false, false);

    constructor(
        injector: Injector,
        private _libraryService: LibraryServiceProxy,
        private _libraryFormService: LibraryFormServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _documentViewService: DocumentViewService,
        private _router: Router,
        public _zone: NgZone
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._getLibraries();
        this._registerToEvents();
    }

    ngOnDestroy(): void {
        this._unsubscribeFromEvents();
    }

    getAll(input: GetAllFormsInput): void {
        this._libraryFormService.getAll(
            this.libraryId,
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

    edit(id) {
        // console.log('Trickster');
        this._documentViewService.formSetting.viewModeSettings = undefined;
        this._router.navigate(['app/admin/forms-library', id, 'edit-document']);
    }

    delete(item: IHasFormListDto) {
        this.message.confirm(
            this.l('FormDeleteWarningMessage', item.form.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._libraryFormService.delete(item.form.id, this.libraryId).subscribe(r => {
                        this.table.getListings();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    public openModal(): void {
        this.uploadDocumentModal.show();
    }

    public fileSaved(event: any): void {
        this.table.getListings();
    }

    public onDownloadOriginalDocument(item: IHasFormListDto) {
        const input = new DownloadOriginalDocumentInput({
            id: this.libraryId,
            form: new EntityDtoOfGuid({ id: item.form.id })
        });

        this._libraryService.downloadOriginalDocument(input)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    private _registerToEvents() {
        abp.event.on('app.document.notification.received', this._documentNotificationReceived);
    }

    private _unsubscribeFromEvents() {
        abp.event.off('app.document.notification.received', this._documentNotificationReceived);
    }

    private _documentNotificationReceived = (notification: DocumentNotification) => {
        if (notification.parentId === this.libraryId) {
            this._zone.run(() => {
                this.table.getListings();
            });
        }
    }

    private _getLibraries(): void {
        this._libraryService.getAll(undefined, undefined, 100, 0)
            .subscribe(result => {
                this.libraries = result.items.map(i => new SelectListItem(i.id, i.name));
                if (result.items.length) {
                    this.libraryId = result.items[0].id;
                } else {
                    this.libraryId = undefined;
                }

                this.table.getListings();
            });
    }
}
