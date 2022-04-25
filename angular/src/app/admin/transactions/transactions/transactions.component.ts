import { Component, HostBinding, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransactionListDto, TransactionServiceProxy, TransactionStatus, TransactionType, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DuplicateTransactionModalComponent } from '../modals/duplicate-transaction-modal/duplicate-transaction-modal.component';

@Component({
    templateUrl: './transactions.component.html',
    animations: [accountModuleAnimation()]
})
export class TransactionsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.transactions') class = true;
    @ViewChild('duplicateTransactionModal', { static: true }) duplicateTransactionModal: DuplicateTransactionModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
        agentId: undefined,
        customer: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];
    filteredCustomers: UserSearchDto[];

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Delete')),
        new UiTableActionItem(this.l('Duplicate')),
    ];

    constructor(
        injector: Injector,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _router: Router,
    ) {
        super(injector);
        this.filter.agentId = this.appSession.user.publicId;
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getTransactions();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getTransactions(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._transactionServiceProxy.getAll(
            this.filter.filterText,
            this.filter.agentId,
            this.filter.customer?.publicId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    public selectEditItem(event: TransactionListDto): void {
        this._router.navigate(['app/admin/transactions', event.id]);
    }

    public actions(record: TransactionListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }, record: TransactionListDto): void {
        switch (element.item.name) {
            case this.l('Delete'):
                this.message.confirm(
                    this.l('DeleteWarningMessage'),
                    this.l('AreYouSure'),
                    (isConfirmed) => {
                        if (isConfirmed) {
                            this._transactionServiceProxy.delete(element.id).subscribe(transactionId => {
                                this.getTransactions();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
                break;
            case this.l('Duplicate'):
                this.duplicateTransactionModal.show(record.id, record.name);
                break;
        }
    }

    getStatusDescription(status: TransactionStatus) {
        switch (status) {
            case TransactionStatus.Open: return 'Open';
            case TransactionStatus.Active: return 'Active';
            case TransactionStatus.Pending: return 'Pending';
            case TransactionStatus.Expired: return 'Expired';
            case TransactionStatus.Withdrawn: return 'Withdrawn';
            case TransactionStatus.ClosedFileComplete: return 'Closed File Complete';
            case TransactionStatus.Closed: return 'Closed';
            default: return '';
        }
    }

    getTypeDescription(status: TransactionType) {
        switch (status) {
            case TransactionType.None: return 'None';
            case TransactionType.ResidentialLease: return 'Residential Lease';
            case TransactionType.ResidentialListing: return 'Residential Listing';
            case TransactionType.ResidentialSale: return 'Residential Sale';
            default: return '';
        }
    }

    onTransactionCreate(id) {
        this._router.navigate(['app/admin/transactions', id]);
    }
}
