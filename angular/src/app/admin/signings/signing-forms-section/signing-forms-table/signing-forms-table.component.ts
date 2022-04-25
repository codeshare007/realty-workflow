import { AfterViewInit, Component, EventEmitter, Injector, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsTableComponent, FormsTableOptions } from '@app/shared/components/forms-library/forms-library-table/forms-table.component';
import { GetAllFormsInput, IHasFormListDto } from '@app/shared/components/forms-library/models/table-documents.model';
import { DocumentNotification } from '@app/shared/layout/notifications/DocumentNotificationHelper';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloadOriginalDocumentInput, DownloadSignedDocumentInput, EntityDtoOfGuid, PagedResultDtoOfSigningFormListDto, SigningFormServiceProxy, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UploadDocumentModalComponent } from '../modals/upload-document-modal/upload-document-modal.component';

@Component({
    selector: 'signing-forms-table',
    templateUrl: './signing-forms-table.component.html'
})
export class SigningFormsTableComponent extends AppComponentBase implements AfterViewInit, OnDestroy {

    @ViewChild('uploadDocumentRef', { static: true }) uploadDocumentModal: UploadDocumentModalComponent;
    @ViewChild('formTable', { static: true }) table: FormsTableComponent;

    @Input() signingId: string;
    @Input() signingName: string;
    @Input() signingCompleted: boolean;
    @Input() allowEdit: boolean;
    @Output() recordsCount = new EventEmitter<number>();

    filterText = '';
    items: IHasFormListDto[];
    totalCount: number;
    options = new FormsTableOptions(false, true, false, false, false);
    formsInput: GetAllFormsInput;
    active = false;
    loading = true;

    constructor(
        injector: Injector,
        private _router: Router,
        private _signingFormService: SigningFormServiceProxy,
        private _signingService: SigningServiceProxy,
        private _fileDownloadService: FileDownloadService,
        public _zone: NgZone
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._registerToEvents();
        this.active = true;
        this.getAll();
    }

    ngOnDestroy(): void {
        this._unsubscribeFromEvents();
        this.loading = true;
        this.active = false;
    }

    public getAll(input?: GetAllFormsInput): void {
        this.formsInput = input ? input : this.formsInput;

        if (!this.active) { return; }

        this._signingFormService.getAll(
            this.signingId,
            this.filterText,
            this.formsInput.sorting,
            this.formsInput.maxResultCount,
            this.formsInput.skipCount,
        )
            .subscribe((result: PagedResultDtoOfSigningFormListDto) => {
                this.items = result.items;
                this.totalCount = result.totalCount;
                this.recordsCount.emit(result.totalCount);
                this.loading = false;
            });
    }

    public delete(item: IHasFormListDto) {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.form.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._signingFormService.delete(item.form.id, this.signingId).subscribe(r => {
                        this.table.getListings();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    public onDownloadOriginalDocument(item: IHasFormListDto) {
        const input = new DownloadOriginalDocumentInput({
            id: this.signingId,
            form: new EntityDtoOfGuid({ id: item.form.id })
        });

        this._signingService.downloadOriginalDocument(input)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    public onDownloadSignedDocument(item: IHasFormListDto) {
        const input = new DownloadSignedDocumentInput({
            id: this.signingId,
            form: new EntityDtoOfGuid({ id: item.form.id })
        });

        this._signingService.downloadSignedDocument(input)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    public openModal(): void {
        this.uploadDocumentModal.show();
    }

    public reload(event: any): void {
        this.table.getListings();
    }

    private _registerToEvents(): void {
        abp.event.on('app.document.notification.received', this._documentNotificationReceived);
    }

    private _unsubscribeFromEvents(): void {
        abp.event.off('app.document.notification.received', this._documentNotificationReceived);
    }

    private _documentNotificationReceived = (notification: DocumentNotification) => {
        if (notification.parentId === this.signingId) {
            this._zone.run(() => {
                this.table.getListings();
            });
        }
    }
}
