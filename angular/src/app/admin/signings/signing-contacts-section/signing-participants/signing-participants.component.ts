import { AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UpdateContactModalComponent } from '@app/shared/components/modals/create-edit-contact-modal/update-contact-modal.component';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddressDto, ContactDto, ContactListDto, ContactType, CreateAddressInput, CreateContactInput, CreateSigningParticipantInput, EntityDtoOfGuid, PagedResultDtoOfContactListDto, SigningParticipantServiceProxy, UpdateSigningParticipantInput } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SelectTransactionParticipantModalComponent } from '../select-transaction-participant-modal/select-transaction-participant-modal.component';

@Component({
    selector: 'signing-participants',
    templateUrl: './signing-participants.component.html',
    animations: [accountModuleAnimation()]
})
export class SigningParticipantsComponent extends AppComponentBase implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('updateContactModal', { static: true }) updateContactModal: UpdateContactModalComponent;
    @ViewChild('selectTransactionParticipantModal', { static: true }) selectTransactionParticipantModal: SelectTransactionParticipantModalComponent;

    @Input() signingId: string;
    @Input() allowEdit: boolean;

    active = false;
    loading = true;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
    };

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Delete')),
    ];

    constructor(
        injector: Injector,
        private _signingParticipantServiceProxy: SigningParticipantServiceProxy,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.active = true;
        this.getParticipants();
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getParticipants();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
        this.loading = true;
        this.active = false;
    }

    public getParticipants(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        if (!this.active) { return; }

        this._signingParticipantServiceProxy.getAll(
            this.signingId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event))
            .subscribe((result: PagedResultDtoOfContactListDto) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.loading = false;
            });
    }

    public actions(record: ContactListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public clickEditAction(event: ContactListDto): void {
        this._signingParticipantServiceProxy.getForEdit(event.id, this.signingId)
            .subscribe(contact => {
                this.updateContactModal.show(contact);
            });
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Delete'):
                this._signingParticipantServiceProxy.delete(element.id, this.signingId)
                    .subscribe(() => {
                        this.getParticipants();
                    });
                break;
        }
    }

    addFromTransaction(transactionId: string) {
        this.selectTransactionParticipantModal.show(transactionId);
    }

    public addSelectedFromTransaction(participantId: string): void {
        this._signingParticipantServiceProxy.addFromTransaction(this.signingId, participantId)
            .subscribe(r => {
                this.getParticipants();
            });
    }

    public selectedManyParticipans(participantIds: string[]): void {
        participantIds.forEach((participantId: string) => {
            this.addSelectedFromTransaction(participantId);
        });
    }

    addYourself() {
        let contact = new ContactDto();
        contact.type = ContactType.General;
        contact.firstName = this.appSession.user.name;
        contact.lastName = this.appSession.user.surname;
        contact.email = this.appSession.user.emailAddress;
        contact.address = new AddressDto({
            id: '',
            streetNumber: '',
            streetName: '',
            unitNumber: '',
            city: '',
            state: '',
            zipCode: ''
        });

        this.onContactCreate(contact);
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
            let input = new CreateSigningParticipantInput();
            input.signing = new EntityDtoOfGuid();
            input.signing.id = this.signingId;
            input.participant = contact;

            this._signingParticipantServiceProxy.create(input)
                .subscribe(r => {
                    this.getParticipants();
                });
        } else {
            let input = new UpdateSigningParticipantInput();
            input.signing = new EntityDtoOfGuid();
            input.signing.id = this.signingId;
            input.participant = contact;

            this._signingParticipantServiceProxy.update(input)
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
