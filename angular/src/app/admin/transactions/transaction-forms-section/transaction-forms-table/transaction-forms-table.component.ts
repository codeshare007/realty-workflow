import { AfterViewInit, Component, Injector, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentViewService } from '@app/shared/components/forms-library/form-library-document/components/document-view/services/document-view.service';
import { FormsTableComponent, FormsTableOptions } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { DocumentNotification } from '@app/shared/layout/notifications/DocumentNotificationHelper';
import { UpdateFormListenerService } from '@app/shared/services/update-form-listener.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddFromLibraryInput, AddTransactionFromInput, CreateWithTransactionFormsInput, DownloadOriginalDocumentInput, EntityDtoOfGuid, LibraryServiceProxy, SigningServiceProxy, TransactionFormServiceProxy, TransactionServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { takeUntil } from 'rxjs/operators';
import { UploadDocumentModalComponent } from '../modals/upload-document-modal/upload-document-modal.component';

@Component({
    selector: 'transaction-forms-table',
    templateUrl: './transaction-forms-table.component.html',
    providers: [
        UpdateFormListenerService,
    ],
})
export class TransactionFormsTableComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Input() transactionId: string;

    libraryId: string;
    filterText = '';
    items: IHasFormListDto[];
    totalCount: number;
    options = new FormsTableOptions(true, true, false, false, true);
    selectedIds: string[] = [];

    constructor(
        injector: Injector,
        private _router: Router,
        private _libraryService: LibraryServiceProxy,
        private _signingServiceProxy: SigningServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _transactionService: TransactionServiceProxy,
        private _transactionFormService: TransactionFormServiceProxy,
        public updateFormListenerService: UpdateFormListenerService,
        private _documentViewService: DocumentViewService,
        public _zone: NgZone
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.selectedIds = new Array();
        this._getLibraries();
        this._registerToEvents();
        this._isLoadingChange();
    }

    ngOnDestroy(): void {
        this._unsubscribeFromEvents();
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
        // console.log('Trickster');
        this._documentViewService.formSetting.viewModeSettings = undefined;
        this._router.navigate(['app/admin/transactions/', this.transactionId, 'form-design', id]);
    }

    delete(item: IHasFormListDto) {
        this.message.confirm(
            this.l('FormDeleteWarningMessage', item.form.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._transactionFormService.delete(item.form.id, this.transactionId).subscribe(r => {
                        this.table.getListings();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    createSigning() {
        let input = new CreateWithTransactionFormsInput();
        input.id = this.transactionId;
        input.forms = this.selectedIds.map(i => new EntityDtoOfGuid({ id: i }));

        this._signingServiceProxy.createWithTransactionForms(input).subscribe(signingId => {
            this._router.navigate(['app/admin/signings', signingId]);
            this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }

    public addFromLibraries(formLibraryIds: string[]): void {
        formLibraryIds.forEach((formLibraryId: string) => {
            this.addFromLibrary(formLibraryId);
        });
    }

    public addFromLibrary(formLibraryId: string) {
        let input = new AddFromLibraryInput({
            id: this.transactionId,
            form: new EntityDtoOfGuid({
                id: formLibraryId
            })
        });
        this.updateFormListenerService.isLoading = true;
        this._transactionFormService.addFromLibrary(input)
            .subscribe((result: string) => {
                this.updateFormListenerService.setDebounceCheckUpdate(true);
                this.table.getListings();
                this.notify.success(this.l('SuccessfullySaved'));
            });
    }

    addTransactionForm(transactionFormId: string, transactionId: string) {
        let input = new AddTransactionFromInput({
            id: this.transactionId,
            transactionId: transactionId,
            form: new EntityDtoOfGuid({
                id: transactionFormId
            })
        });

        this._transactionFormService.addTransactionFrom(input)
            .subscribe(r => {
                setTimeout(() => {
                    this.table.getListings();
                    this.notify.success(this.l('SuccessfullySaved'));
                }, 0);
            });
    }

    public openModal(): void {
        this.uploadDocumentModal.show();
    }

    public fileSaved(event: any): void {
        this.table.getListings();
    }

    public onDownloadOriginalDocument(item: IHasFormListDto) {
        const input = new DownloadOriginalDocumentInput({
            id: this.transactionId,
            form: new EntityDtoOfGuid({ id: item.form.id })
        });

        this._transactionService.downloadOriginalDocument(input)
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
        if (notification.parentId === this.transactionId) {
            this._zone.run(() => {
                this.table.getListings();
            });
        }
    }

    private _getLibraries(): void {
        this._libraryService.getAll(undefined, undefined, 100, 0)
            .subscribe(result => {
                if (result.items.length) {
                    this.libraryId = result.items[0].id;
                } else {
                    this.libraryId = undefined;
                }
            });
    }

    private _isLoadingChange(): void {
        this.updateFormListenerService.getDebounceCheckUpdate$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                this.updateFormListenerService.isLoading = false;
            });
    }
}
