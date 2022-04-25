import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { AppConsts } from '@shared/AppConsts';
import { ContactType, CreateContactInput, UpdateContactInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'update-contact-modal',
    templateUrl: './update-contact-modal.component.html',
})
export class UpdateContactModalComponent {

    @ViewChild('updateModalRef', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    contact: CreateContactInput | UpdateContactInput;
    regexp = new RegExp(AppConsts.emailRegExp);
    typeValues = [
        new SelectListItem(ContactType.General, 'General'),
        new SelectListItem(ContactType.Lessor, 'Lessor'),
        new SelectListItem(ContactType.Buyer, 'Buyer'),
        new SelectListItem(ContactType.Lessee, 'Lessee'),
        new SelectListItem(ContactType.Agent, 'Agent'),
        new SelectListItem(ContactType.Lawyer, 'Lawyer'),
        new SelectListItem(ContactType.Seller, 'Seller')
    ];

    get isCreate(): boolean {
        return this.contact instanceof CreateContactInput;
    }

    public show(contact: CreateContactInput | UpdateContactInput): void {
        this.contact = contact;
        this.active = true;
        this.modal.show();
    }

    public onShown(): void {
        document.getElementById('PhoneNumber').focus();
    }

    public save(): void {
        this.modalSave.emit(this.contact);
        this.close();
    }

    public close(): void {
        this.active = false;
        this.contact = null;
        this.modal.hide();
    }
}
