import { Component, Injector, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectListItem } from '@app/admin/shared/general-combo.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateFormInput, CreateSigningFormInput, SigningFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'upload-document-modal',
    templateUrl: './upload-document-modal.component.html',
})
export class UploadDocumentModalComponent extends AppComponentBase {

    @ViewChild('uploadDocumentModal', { static: true }) modal: ModalDirective;
    @ViewChild(NgForm, { static: true }) photoForm: NgForm;
    @Input() signingId: string;
    // @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    name: string;
    uploadUrl: string;
    uploadedFileId: string;
    uploadedFileName: string;

    libraries: SelectListItem[];

    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _signingFormService: SigningFormServiceProxy,
    ) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/File/UploadFile';
    }

    public onUpload(event): void {
        let result = event.originalEvent.body.result;
        this.uploadedFileId = result.id;
        this.uploadedFileName = result.fileName;
    }

    public onSend(event): void {
    }

    public onBeforeSend(event): void {
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
                this.close();
            });
    }
}
