import { Component, HostBinding, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateContactModalComponent } from '@app/shared/components/modals/create-edit-contact-modal/update-contact-modal.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactDto, ContactListDto, ContactType, CreateAddressInput, CreateContactInput, CreateTransactionParticipantInput, TransactionParticipantServiceProxy, UpdateTransactionParticipantInput } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'transaction-participants',
    templateUrl: './transaction-participants.component.html',
    animations: [accountModuleAnimation()]
})
export class TransactionParticipantsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.transaction-participants') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('updateContactModalRef', { static: true }) updateContactModal: UpdateContactModalComponent;

    @Input() transactionId: string;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
    };

    constructor(
        injector: Injector,
        private _transactionParticipantServiceProxy: TransactionParticipantServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getParticipants();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getParticipants(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._transactionParticipantServiceProxy.getAll(
            this.filter.filterText,
            this.transactionId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    editForm(record: ContactListDto) {
        this._transactionParticipantServiceProxy.getForEdit(record.id, this.transactionId)
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
                    this._transactionParticipantServiceProxy.delete(record.id, this.transactionId).subscribe(contact => {
                        this.getParticipants();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    createNewContact() {
        let contact = new CreateContactInput({
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
            address: new CreateAddressInput({
                streetNumber: '',
                streetName: '',
                unitNumber: '',
                city: '',
                state: '',
                zipCode: ''
            })
        });

        this.updateContactModal.show(contact);
    }

    public onContactCreate(contact: ContactDto) {
        if (!contact.id) {
            let input = new CreateTransactionParticipantInput();
            input.transactionId = this.transactionId;
            input.participant = contact;

            this._transactionParticipantServiceProxy.create(input)
                .subscribe(r => {
                    this.getParticipants();
                });
        } else {
            let input = new UpdateTransactionParticipantInput();
            input.transactionId = this.transactionId;
            input.participant = contact;

            this._transactionParticipantServiceProxy.update(input)
                .subscribe(r => {
                    this.getParticipants();
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
