import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PagedResultDtoOfSigningListDto, SigningListDto, SigningServiceProxy, UserSearchDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DuplicateSigningModalComponent } from '../duplicate-signing-modal/duplicate-signing-modal.component';

@Component({
    templateUrl: './signings.component.html',
    animations: [accountModuleAnimation()]
})
export class SigningsComponent extends AppComponentBase implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('duplicateSigningModal', { static: true }) duplicateSigningModal: DuplicateSigningModalComponent;

    active = false;
    loading = true;

    public filterTextSubject: Subject<string> = new Subject<string>();
    filter = {
        filterText: '',
        agentId: '',
        customer: new UserSearchDto(),
    };
    filteredAgents: UserSearchDto[];
    filteredCustomers: UserSearchDto[];

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Duplicate')),
        new UiTableActionItem(this.l('DuplicateForNextSigning')),
        new UiTableActionItem(this.l('Delete')),
    ];

    constructor(
        injector: Injector,
        private _signingServiceProxy: SigningServiceProxy,
        private _router: Router,
    ) {
        super(injector);
        this.filter.agentId = this.appSession.user.publicId;
    }

    ngAfterViewInit(): void {
        this.active = true;
        this.getSignings();
    }

    ngOnInit(): void {
        this.filterTextSubject.pipe(debounceTime(500)).subscribe(filterText => {
            this.filter.filterText = filterText;
            this.getSignings();
        });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
        this.loading = true;
        this.active = false;
    }

    public goToTransaction(record: SigningListDto): void {
        this._router.navigate(['app/admin/transactions', record.transactionId]);
    }

    public getSignings(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }
        if (!this.active) { return; }

        this._signingServiceProxy.getAll(
            this.filter.filterText,
            this.filter.agentId,
            undefined,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event))
            .subscribe((result: PagedResultDtoOfSigningListDto) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.loading = false;
            });
    }

    public actions(record: SigningListDto): UiTableActionItem[] {
        return this.actionsList.filter(f =>
            (record.signedFileGenerated || f.name != this.l('DuplicateForNextSigning')) &&
            (record.status == 0 || record.status == 1 || f.name != this.l('Delete')));
    }

    public selectEditOption(record: SigningListDto): void {
        this._router.navigate(['app/admin/signings', record.id]);
    }

    public selectOption(element: { item: UiTableActionItem, id: string }, record: SigningListDto): void {
        switch (element.item.name) {
            case this.l('Delete'):
                this.message.confirm(
                    this.l('DeleteWarningMessage'),
                    this.l('AreYouSure'),
                    (isConfirmed) => {
                        if (isConfirmed) {
                            this._signingServiceProxy.delete(element.id).subscribe(signingId => {
                                this.getSignings();
                                this.notify.success(this.l('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
                break;
            case this.l('Duplicate'):
                this.duplicateSigningModal.show(record.id, record.name, false);
                break;
            case this.l('DuplicateForNextSigning'):
                this.duplicateSigningModal.show(record.id, record.name, true);
                break;
        }
    }
}
