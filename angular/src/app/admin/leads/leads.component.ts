import { Component, HostBinding, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetUsersInput, LeadListDto, LeadServiceProxy, LeadStatus, PagedResultDtoOfLeadListDto, UserSearchDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LeadToTransactionModalComponent } from './recommended-listings/modals/lead-to-transaction-modal/lead-to-transaction-modal.component';

@Component({
    templateUrl: './leads.component.html',
    animations: [accountModuleAnimation()]
})
export class LeadsComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.leads') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('leadToTransactionModalRef') leadToTransactionModal: LeadToTransactionModalComponent;

    public filterTextSubject: Subject<string> = new Subject<string>();
    active = false;
    saving = false;

    filter = {
        filterText: '',
        agentId: undefined,
        customer: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];
    filteredCustomers: UserSearchDto[];


    actionsList: UiTableActionItem[] = [
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
        this.filter.agentId = this.appSession.user.publicId;
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
            this.filter.agentId,
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

    public clickEditAction(record: LeadListDto): void {
        this._router.navigate(['app/admin/lead', record.id]);
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('CreateTransaction'):
                this.leadToTransactionModal.show('', element.id, undefined);
                break;
            case this.l('Delete'):
                this.message.confirm(
                    this.l('DeleteWarningMessage'),
                    this.l('AreYouSure'),
                    (isConfirmed) => {
                        if (isConfirmed) {
                            this._leadServiceProxy.delete(element.id).subscribe(transactionId => {
                                this.getLeads();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
                break;
        }
    }

    clearAgentFilter() {
        this.filter.agentId = undefined;
        this.getLeads();
    }

    clearCustomerFilter() {
        this.filter.customer = undefined;
        this.getLeads();
    }

    getStatusDescription(status: LeadStatus) {
        switch (status) {
            case LeadStatus.New: return 'New';
            case LeadStatus.Active: return 'Active';
            case LeadStatus.Closed: return 'Closed';
            case LeadStatus.Disqualified: return 'Disqualified';
            default: return '';
        }
    }
}
