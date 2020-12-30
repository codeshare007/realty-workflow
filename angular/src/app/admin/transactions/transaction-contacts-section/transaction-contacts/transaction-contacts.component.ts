import { Component, Injector, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddressDto, ContactDto, ContactInfoDto, ContactType, CreateTransactionContactInput, TransactionContactServiceProxy, UpdateTransactionContactInput } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CreateEditContactModalComponent } from '../create-edit-contact-modal/create-edit-contact-modal.component';

@Component({
    selector: 'transaction-contacts',
    templateUrl: './transaction-contacts.component.html',
    styleUrls: ['./transaction-contacts.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class TransactionContactsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createEditContactModal', { static: true }) createEditContactModal: CreateEditContactModalComponent;

    @Input() transactionId: string;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
    };

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Edit')),
        new UiTableActionItem(this.l('Delete')),
    ];

    constructor(
        injector: Injector,
        private _transactionContactServiceProxy: TransactionContactServiceProxy,
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

        this._transactionContactServiceProxy.getAll(
            this.filter.filterText,
            this.transactionId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
            this.primengTableHelper.records = res.items;
            this.primengTableHelper.totalRecordsCount = res.totalCount;
        });
    }

    public actions(record: ContactInfoDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Edit'):
                this._transactionContactServiceProxy.getForEdit(element.id, this.transactionId)
                    .subscribe(contact => {
                        this.createEditContactModal.show(contact);
                    });
                break;
            case this.l('Delete'):
                this._transactionContactServiceProxy.delete(element.id, this.transactionId)
                    .subscribe(contact => {
                        this.getContacts();
                    });
                break;
        }
    }

    createNewContact() {
        let contact = new ContactDto({
            type: ContactType.General,
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            legalName: '',
            preferredSignature: '',
            preferredInitials: '',
            firm: '',
            suffix: '',
            company: '',
            lastModificationTime: undefined,
            id: undefined,
            address: new AddressDto({
                streetNumber: '',
                streetName: '',
                unitNumber: '',
                city: '',
                state: '',
                zipCode: '',
                id: undefined
            })
        });

        this.createEditContactModal.show(contact);
    }

    public onContactCreate(contact: ContactDto) {
        if (!contact.id) {
            let input = new CreateTransactionContactInput();
            input.transactionId = this.transactionId;
            input.contact = contact;

            this._transactionContactServiceProxy.create(input)
            .subscribe(r => {
                this.getContacts();
            });
        } else {
            let input = new UpdateTransactionContactInput();
            input.transactionId = this.transactionId;
            input.contact = contact;

            this._transactionContactServiceProxy.update(input)
            .subscribe(r => {
                this.getContacts();
            });
        }
    }

    getTypeDescription(status: ContactType) {
        switch(status) {
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
