import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { UpdateSigningRequestAccessEmail } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'edit-participant-email-modal',
    templateUrl: './edit-participant-email-modal.component.html',
})
export class EditParticipantEmailModalComponent {

    @ViewChild('updateModalRef', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<UpdateSigningRequestAccessEmail> = new EventEmitter<UpdateSigningRequestAccessEmail>();

    active = false;
    saving = false;
    data: UpdateSigningRequestAccessEmail;
    regexp = new RegExp(AppConsts.emailRegExp);
    
    public show(data: UpdateSigningRequestAccessEmail): void {
        this.data = data;
        this.active = true;
        this.modal.show();
    }

    public onShown(): void {
        document.getElementById('SigningRequestAccessEmail').focus();
    }

    public save(): void {
        this.modalSave.emit(this.data);
        this.close();
    }

    public close(): void {
        this.active = false;
        this.data = null;
        this.modal.hide();
    }
}
