import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningListDto, SigningServiceProxy, SigningStatus, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'signings-table',
    templateUrl: './signings.component.html',
    animations: [accountModuleAnimation()]
})
export class SigningsTableComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() transactionId: string;
    @Input() transactionName: string;

    active = false;
    saving = false;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
        agent: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];

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
            this.transactionId,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)).subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    editForm(record: SigningListDto) {
        this._router.navigate(['app/admin/signings', record.id]);
    }

    deleteForm(record: SigningListDto) {
        this.message.confirm(
            this.l('DeleteWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._signingServiceProxy.delete(record.id).subscribe(result => {
                        this.getSignings();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }
}
