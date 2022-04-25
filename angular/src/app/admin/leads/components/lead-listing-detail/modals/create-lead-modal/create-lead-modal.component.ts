import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectListItem } from '@app/admin/shared/general-combo-string.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddressDto, ContactDto, ContactType, CreateLeadInput, LeadServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'create-lead-modal',
    templateUrl: './create-lead-modal.component.html',
    styleUrls: ['create-lead-modal.component.less']
})
export class CreateLeadModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    regexp = new RegExp(AppConsts.emailRegExp);
    active = false;
    saving = false;
    contact: ContactDto;
    typeValues = [
        new SelectListItem(ContactType.General, 'General'),
        new SelectListItem(ContactType.Lessor, 'Lessor'),
        new SelectListItem(ContactType.Buyer, 'Buyer'),
        new SelectListItem(ContactType.Lessee, 'Lessee'),
        new SelectListItem(ContactType.Agent, 'Agent'),
        new SelectListItem(ContactType.Lawyer, 'Lawyer'),
        new SelectListItem(ContactType.Seller, 'Seller')
    ];

    constructor(
        injector: Injector,
        private _leadService: LeadServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    public show(): void {
        this.contact = new ContactDto();
        this.contact.address = new AddressDto();

        this.active = true;
        this.modal.show();
    }

    public onShown(): void {
        document.getElementById('PhoneNumber').focus();
    }

    public save(): void {
        let input = new CreateLeadInput();
        input.contact = this.contact;

        this._leadService.createLead(input).subscribe(id => {
            this.close();
            this._router.navigate(['app/admin/lead', id, 'search-listings']);
        });
    }

    public close(): void {
        this.active = false;
        this.contact = null;
        this.modal.hide();
    }
}
