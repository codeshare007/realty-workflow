import { Component, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransactionListDto, TransactionServiceProxy, TransactionStatus, TransactionType, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class TransactionsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
        agent: new UserSearchDto(),
        customer: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];
    filteredCustomers: UserSearchDto[];

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Edit')),
        new UiTableActionItem(this.l('Dublicate')),
        new UiTableActionItem(this.l('Delete')),
    ];

    constructor(
        injector: Injector,
        private _transactionServiceProxy: TransactionServiceProxy,
        private _router: Router,
    ) {
        super(injector);
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
            this.filter.agent?.publicId,
            this.filter.customer?.publicId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
            this.primengTableHelper.records = res.items;
            this.primengTableHelper.totalRecordsCount = res.totalCount;
        });
    }

    public actions(record: TransactionListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Edit'):
                this._router.navigate(['app/admin/transactions', element.id]);
                break;
            case this.l('CreateTransaction'):
                this._transactionServiceProxy.delete(element.id).subscribe(transactionId => {
                    this.getTransactions();
                });
                break;
        }
    }

    getStatusDescription(status: TransactionStatus) {
        switch(status) {
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
        switch(status) {
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
