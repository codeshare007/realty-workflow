import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateAttachmentInput, CreateTransactionAttachmentInput, TransactionServiceProxy } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'create-transaction-attachment-modal',
    templateUrl: './create-transaction-attachment-modal.component.html'
})
export class CreateTransactionAttachmentModalComponent extends AppComponentBase {

    @ViewChild('createTransactionAttachmentModal', { static: true }) modal: ModalDirective;
    @ViewChild('attachmentName', { static: true }) nameInput: ElementRef;
    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    transactionId: string;

    name: string;
    description: string;
    uploadUrl: string = AppConsts.remoteServiceBaseUrl + '/TransactionFile/UploadFile';
    uploadedFileId: string;
    uploadedFileName: string;

    active = false;
    saving = false;

    private _mimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
    ]

    mimeTypesFomatted = this._mimeTypes.join(',');

    get getChooseLabel() {
        return isUndefined(this.uploadedFileId) ? 'Choose Document' : this.uploadedFileName;
    }

    get getChooseIcon() {
        return isUndefined(this.uploadedFileId) ? 'pi-plus' : 'pi-pencil';
    }

    constructor(
        injector: Injector,
        private _transactionService: TransactionServiceProxy,
    ) {
        super(injector);
    }

    public onUpload(event): void {
        let result = event.originalEvent.body.result;
        this.uploadedFileId = result.id;
        if (event && event.files.length) {
            this.uploadedFileName = event.files[0].name;

            if (!this.name || this.name.length === 0) {
                this.name = this.uploadedFileName;
            }
        }
        this.saving = false;
    }

    public onBeforeUpload(event) {
        if (isUndefined(event) || isUndefined(event.formData)) {
            return;
        }
        event.formData.set('EntityId', this.transactionId);
        this.saving = true;
    }

    public show(transactionId: string): void {
        this.active = true;
        this.modal.show();

        this.transactionId = transactionId;

        this.uploadedFileName = undefined;
        this.uploadedFileId = undefined;
        this.name = undefined;
        this.description = undefined;
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        const input = new CreateTransactionAttachmentInput();
        input.id = this.transactionId;
        input.attachment = new CreateAttachmentInput();
        input.attachment.fileId = this.uploadedFileId;
        input.attachment.name = this.name;
        
        this.saving = true;
        this._transactionService.createAttachment(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this.modalSave.emit();
                this.close();
            });
    }

    public onShown(event) {
        document.getElementById('Name').focus();
    }
}
