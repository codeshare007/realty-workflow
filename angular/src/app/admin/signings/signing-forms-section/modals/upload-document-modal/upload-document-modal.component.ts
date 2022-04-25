import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateFormInput, CreateSigningFormInput, SigningFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'upload-document-modal',
    templateUrl: './upload-document-modal.component.html'
})
export class UploadDocumentModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() signingId: string;

    name: string;
    uploadUrl: string = AppConsts.remoteServiceBaseUrl + '/File/UploadFile';
    uploadedFileId: string;
    uploadedFileName: string;

    libraries: SelectListItem[];

    active = false;
    saving = false;

    get getChooseLabel() {
        return isUndefined(this.uploadedFileId) ? 'Choose Document' : this.uploadedFileName;
    }

    get getChooseIcon() {
        return isUndefined(this.uploadedFileId) ? 'pi-plus' : 'pi-pencil';
    }

    constructor(
        injector: Injector,
        private _signingFormService: SigningFormServiceProxy,
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/SigningFile/UploadFile';
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
    }

    public onBeforeUpload(event): void {
        if (isUndefined(event) || isUndefined(event.formData)) {
            return;
        }

        event.formData.set('EntityId', this.signingId);
    }

    public show(): void {
        this.active = true;
        this.modal.show();

        this.uploadedFileName = undefined;
        this.uploadedFileId = undefined;
        this.name = undefined;
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        const input = new CreateSigningFormInput();
        input.id = this.signingId;
        input.form = new CreateFormInput();
        input.form.fileId = this.uploadedFileId;
        input.form.name = this.name;

        this.saving = true;
        this._signingFormService.create(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this.modalSave.emit();
                this.close();
            });
    }

}
