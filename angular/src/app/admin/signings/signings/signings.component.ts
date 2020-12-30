import { Component, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningListDto, SigningServiceProxy, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './signings.component.html',
    styleUrls: ['./signings.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class SigningsComponent extends AppComponentBase implements OnInit, OnDestroy {

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
        private _signingServiceProxy: SigningServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getSignings();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getSignings(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this._signingServiceProxy.getAll(
            this.filter.filterText,
            this.filter.agent?.publicId,
            undefined,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
            this.primengTableHelper.records = res.items;
            this.primengTableHelper.totalRecordsCount = res.totalCount;
        });
    }

    public actions(record: SigningListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Edit'):
                this._router.navigate(['app/admin/signings', element.id]);
                break;
            case this.l('CreateSigning'):
                this._signingServiceProxy.delete(element.id).subscribe(signingId => {
                    this.getSignings();
                });
                break;
        }
    }

    getStatusDescription(status: any) {
        return 'New';
    }
}
