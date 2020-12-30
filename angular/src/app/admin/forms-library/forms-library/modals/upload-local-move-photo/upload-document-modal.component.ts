import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateFormInput, CreateLibraryFormInput, LibraryFormServiceProxy, LibraryServiceProxy } from '@shared/service-proxies/service-proxies';
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

    libraryId: string;

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
        private _libraryService: LibraryServiceProxy,
        private _libraryFormService: LibraryFormServiceProxy,
    ) {
        super(injector);
    }

    public onUpload(event): void {
        let result = event.originalEvent.body.result;
        this.uploadedFileId = result.id;
        if (event && event.files.length) {
            this.uploadedFileName = event.files[0].name;
        }
    }

    public show(): void {
        this.active = true;
        this.modal.show();

        this.uploadedFileName = undefined;
        this.uploadedFileId = undefined;
        this.name = undefined;

        this._getLibraries()
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        const input = new CreateLibraryFormInput();
        input.id = this.libraryId;
        input.form = new CreateFormInput();
        input.form.fileId = this.uploadedFileId;
        input.form.name = this.name;

        this.saving = true;
        this._libraryFormService.create(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this.modalSave.emit();
                this.close();
            });
    }

    private _getLibraries(): void {
        this._libraryService.getAll(undefined, undefined, 100, 0)
            .subscribe(result => {
                this.libraries = result.items.map(i => new SelectListItem(i.id, i.name));
                if (result && result.items.length) {
                    this.libraryId = result.items[0].id;
                } else {
                    this.libraryId = undefined;
                }
            });
    }

}
