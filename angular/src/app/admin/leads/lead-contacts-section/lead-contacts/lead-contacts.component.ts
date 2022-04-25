import { Component, HostBinding, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateContactModalComponent } from '@app/shared/components/modals/create-edit-contact-modal/update-contact-modal.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    AddressDto, ContactDto, ContactListDto, ContactType, CreateLeadContactInput, LeadContactServiceProxy, UpdateLeadContactInput
} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'lead-contacts',
    templateUrl: './lead-contacts.component.html',
    animations: [accountModuleAnimation()]
})
export class LeadContactsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.lead-contacts') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('updateContactModalRef', { static: true }) updateContactModal: UpdateContactModalComponent;

    @Input() leadId: string;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
    };

    constructor(
        injector: Injector,
        private _leadContactServiceProxy: LeadContactServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getContacts();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getContacts(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._leadContactServiceProxy.getAll(
            this.filter.filterText,
            this.leadId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    editForm(record: ContactListDto) {
        this._leadContactServiceProxy.getForEdit(record.id, this.leadId)
            .subscribe(contact => {
                this.updateContactModal.show(contact);
            });
    }

    deleteForm(record: ContactListDto) {
        this.message.confirm(
            this.l('DeleteWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._leadContactServiceProxy.delete(record.id, this.leadId).subscribe(contact => {
                        this.getContacts();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    createNewContact() {
        let contact = new ContactDto();
        contact.type = ContactType.General;
        contact.address = new AddressDto();

        this.updateContactModal.show(contact);
    }

    public onContactCreate(contact: ContactDto) {
        if (!contact.id) {
            let input = new CreateLeadContactInput();
            input.leadId = this.leadId;
            input.contact = contact;

            this._leadContactServiceProxy.create(input)
                .subscribe(r => {
                    this.getContacts();
                });
        } else {
            let input = new UpdateLeadContactInput();
            input.leadId = this.leadId;
            input.contact = contact;

            this._leadContactServiceProxy.update(input)
                .subscribe(r => {
                    this.getContacts();
                });
        }
    }

    getTypeDescription(status: ContactType) {
        switch (status) {
            case ContactType.General: return 'General';
            case ContactType.Lessor: return 'Lessor';
            case ContactType.Buyer: return 'Buyer';
            case ContactType.Lessor: return 'Lessor';
            case ContactType.Agent: return 'Agent';
            case ContactType.Lawyer: return 'Lawyer';
            case ContactType.Seller: return 'Seller';
            default: return '';
        }
    }
}
