import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { ControlValueInput, ISignatureInput } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateAttachmentInput } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { SigningService } from 'signing/services/signing.service';

@Component({
    selector: 'upload-attachment-modal',
    templateUrl: './upload-attachment-modal.component.html'
})
export class UploadAttachmentModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;

    @Input() controlerInput: ISignatureInput;

    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    uploadUrl: string = AppConsts.remoteServiceBaseUrl + '/SigningFile/UploadSigningRequestFile';
    uploadedFileId: string;
    uploadedFileName: string;
    saving = false;
    name: string;
    active = false;
    attachmentId: string;

    get getChooseLabel() {
        return isUndefined(this.uploadedFileId) ? 'Choose Document' : this.uploadedFileName;
    }
    get getChooseIcon() {
        return isUndefined(this.uploadedFileId) ? 'pi-plus' : 'pi-pencil';
    }

    constructor(
        injector: Injector,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
        private _signingService: SigningService,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public onUpload(event): void {
        const result = event.originalEvent.body.result;
        this.uploadedFileId = result.id;
        if (event && event.files.length) {
            this.uploadedFileName = event.files[0].name;

            if (!this.name || this.name.length === 0) {
                this.name = this.uploadedFileName;
            }
        }
    }

    public onBeforeUpload(event): void {
        if (isUndefined(event) || isUndefined(event.formData)) {
            return;
        }

        event.formData.set('SigningRequestCode', this._formUrlService.accessTypeItem.id);
    }

    public close(): void {
        this.active = false;
        this.controlerInput = undefined;
        this.attachmentId = undefined;
        this.modal.hide();
    }

    public show(input: ISignatureInput): void {
        this.controlerInput = input;
        this.active = true;
        this.modal.show();
    }

    public save() {
        this.saving = true;
        this._getAttachmentId();
    }

    private _getAttachmentId(): void {
        const input: ControlValueInput = this._formUrlService.getControlInput();
        const attachmentInput = new CreateAttachmentInput();
        attachmentInput.name = this.name;
        attachmentInput.fileId = this.uploadedFileId;
        const data = {
            participantCode: input.participantCode,
            attachment: attachmentInput
        };

        this._httpService.post(this._formUrlService.uploadUrl, data)
            .subscribe((attachmentId) => {
                this.attachmentId = attachmentId.result;
                this._saveAttachmen();
            });
    }

    private _saveAttachmen(): void {
        const { control, pageId, documentId } = this.controlerInput;
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = control.id;
        input.pageId = pageId;
        input.formId = documentId;
        input.value = this.attachmentId;

        this._httpService.post(this._formUrlService.controlUrl, input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                this.modalSave.emit(true);
                this._setFilledProgress();
                this.close();
                this._cdr.markForCheck();
            });
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.controlerInput.control, this.controlerInput.participantId);
    }
}
