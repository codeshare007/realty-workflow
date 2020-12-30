import { Component, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetUsersInput, LeadServiceProxy, LeadStatus, PagedResultDtoOfLeadListDto, UserSearchDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './leads.component.html',
    styleUrls: ['./leads.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class LeadsComponent extends AppComponentBase implements OnInit, OnDestroy {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    public filterTextSubject: Subject<string> = new Subject<string>();
    active = false;
    saving = false;

    filter = {
        filterText: '',
        agent: new UserSearchDto(),
        customer: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];
    filteredCustomers: UserSearchDto[];


    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Edit')),
        new UiTableActionItem(this.l('CreateCustomer')),
        new UiTableActionItem(this.l('CreateTransaction')),
        new UiTableActionItem(this.l('Delete')),
    ];

    constructor(
        injector: Injector,
        private _leadServiceProxy: LeadServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getLeads();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getLeads(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._leadServiceProxy.getLeads(
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

    filterAgents(event): void {
        if (this.permission.isGranted('Pages.Users.Agents')) {
            let input = new GetUsersInput();
            input.filter = event.query;
            input.roleName = 'Agent';

            this._userServiceProxy.searchUser(input).subscribe(agents => {
                this.filteredAgents = agents;
            });
        }
    }

    filterCustomers(event): void {
        if (this.permission.isGranted('Pages.Users.Customers')) {
            let input = new GetUsersInput();
            input.filter = event.query;
            input.roleName = 'Customer';

            this._userServiceProxy.searchUser(input).subscribe(agents => {
                this.filteredAgents = agents;
            });
        }
    }

    public actions(record: PagedResultDtoOfLeadListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Edit'):
                this._router.navigate(['app/admin/lead', element.id]);
                break;
            // case this.l('CreateCustomer'):
            //     this._leadServiceProxy.createLead
            //     console.log('Delete: ');
            //     break;
            case this.l('CreateTransaction'):
                this._leadServiceProxy.createTransaction(element.id, undefined).subscribe(transactionId => {
                    this._router.navigate(['app/admin/transactions', transactionId]);
                });
                break;
        }
    }

    clearAgentFilter() {
        this.filter.agent = undefined;
        this.getLeads();
    }

    clearCustomerFilter() {
        this.filter.customer = undefined;
        this.getLeads();
    }

    getStatusDescription(status: LeadStatus) {
        switch(status) {
            case LeadStatus.New: return 'New'; break;
            case LeadStatus.Active: return 'Active'; break;
            case LeadStatus.Closed: return 'Closed'; break;
            case LeadStatus.Disqualified: return 'Disqualified'; break;
            default: return '';
        }
    }
}
