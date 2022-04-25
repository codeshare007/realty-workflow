import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentViewService } from '@app/shared/components/forms-library/form-library-document/components/document-view/services/document-view.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DuplicateSigningInput, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'duplicate-signing-modal',
    templateUrl: './duplicate-signing-modal.component.html'
})
export class DuplicateSigningModalComponent extends AppComponentBase {

    @ViewChild('duplicateSigningModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    signingId: string;
    forNextSigning: boolean;
    name: string;
    active = false;
    saving = false;

    constructor(
        injector: Injector,
        private _signingServiceProxy: SigningServiceProxy,
        private _router: Router,
        private _documentViewService: DocumentViewService,
    ) {
        super(injector);
    }

    public show(signingId: string, name: string, forNextSigning: boolean): void {
        this.name = name;
        this.signingId = signingId;
        this.forNextSigning = forNextSigning;

        this.active = true;
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save(): void {
        this.saving = true;
        const input = new DuplicateSigningInput();
        input.id = this.signingId;
        input.name = this.name;
        input.forNextSinging = this.forNextSigning;

        this._signingServiceProxy.duplicateSigning(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: string) => {
                // console.log('Trickster');
                this._documentViewService.formSetting.viewModeSettings = undefined;
                this._router.navigate(['app/admin/signings/', result]);
                this.close();
            });
    }
}
