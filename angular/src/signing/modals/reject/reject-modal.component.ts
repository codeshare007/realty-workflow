import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'reject-modal',
    templateUrl: './reject-modal.component.html'
})
export class RejectModalComponent {

    @ViewChild('rejectModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<string> = new EventEmitter<string>();

    comment: string;
    active: boolean;

    public show(): void {
        this.active = true;
        this.modal.show();
        this.comment = undefined;
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        this.modalSave.emit(this.comment);
        this.close();
    }
}
