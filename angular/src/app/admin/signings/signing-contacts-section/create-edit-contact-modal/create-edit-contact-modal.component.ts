import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { SelectListItem } from '@app/admin/shared/general-combo.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactDto, ContactType } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'create-edit-contact-modal',
    templateUrl: './create-edit-contact-modal.component.html',
    styleUrls: ['create-edit-contact-modal.component.less']
})
export class CreateEditContactModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    contact: ContactDto;
    typeValues = [
        new SelectListItem(ContactType.General, 'General'),
        new SelectListItem(ContactType.Lessor, 'Lessor'),
        new SelectListItem(ContactType.Buyer, 'Buyer'),
        new SelectListItem(ContactType.Lessor, 'Lessor'),
        new SelectListItem(ContactType.Agent, 'Agent'),
        new SelectListItem(ContactType.Lawyer, 'Lawyer'),
        new SelectListItem(ContactType.Seller, 'Seller')
    ];

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    show(contact: ContactDto): void {
        this.contact = contact;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        document.getElementById('PhoneNumber').focus();
    }

    save(): void {
        this.modalSave.emit(this.contact);
        this.close();
    }

    close(): void {
        this.active = false;
        this.contact = null;
        this.modal.hide();
    }
}
