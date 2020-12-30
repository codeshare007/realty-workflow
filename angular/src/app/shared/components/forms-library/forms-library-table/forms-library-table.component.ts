import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, Injector, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormStatus, LibraryFormListDto, LibraryFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/internal/operators/finalize';
// import { FormsLibraryService } from '../services/forms-library.service';

@Component({
    selector: 'forms-library-table',
    templateUrl: './forms-library-table.component.html'
})
export class FormsLibraryTableComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @HostBinding('class.forms-library-table') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() transactionId: string;
    @Input() libraryId: string;

    constructor(
        injector: Injector,
        private _router: Router,
        private _cdk: ChangeDetectorRef,
        private _libraryFormsService: LibraryFormServiceProxy,
        private _activatedRoute: ActivatedRoute,
        public _zone: NgZone
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    filterText = '';
    loading = true;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
        this._registerToEvents();
    }

    ngOnDestroy(): void {
        this._unsubscribeFromEvents();
    }


    ngOnChanges({ libraryId }: SimpleChanges): void {
        if (libraryId && libraryId.currentValue !== libraryId.previousValue) {
            this.getListings();
        }
    }

    public getFileImage(contentType: string): string {
        if (contentType === 'application/pdf') {
            return './assets/common/images/pdf.svg';
        }
        return '';
    }

    public getListings(event?: LazyLoadEvent): void {
        if (isUndefined(this.libraryId)) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.loading = true;

        this._libraryFormsService.getAll(
            this.libraryId,
            this.filterText,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            )
            .pipe(finalize(() => this.loading = false))
            .subscribe(result => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
            });


        this._cdk.detectChanges();
    }

    public editForm(record: LibraryFormListDto): void {
        this._router.navigate(['app/admin/forms-library', record.form.id, 'edit-document']);
    }

    public deleteForm(record: LibraryFormListDto): void {

        this.message.confirm(
            this.l('FormDeleteWarningMessage', record.form.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._libraryFormsService.delete(record.form.id, record.id)
                    .subscribe(() => {
                        this.getListings();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    public getBadgeCssClass(status: FormStatus): string {
        switch (status) {
            case FormStatus.New:
                return 'label-light-primary';
            case FormStatus.Processing:
                return 'label-light-warning';
            case FormStatus.Ready:
                return 'label-light-success';
        }
    }

    public getBusyState(status: FormStatus): boolean {
        if (status === FormStatus.Processing) {
            return true;
        }
        return false;
    }

    private _registerToEvents() {
        abp.event.on('app.document.notification.received', this._documentNotificationReceived);
    }

    private _unsubscribeFromEvents() {
        abp.event.off('app.document.notification.received', this._documentNotificationReceived);
    }

    private _documentNotificationReceived = () => {
        this._zone.run(() => {
            this.getListings();
        });
    }
}
