import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NameValueDto, PagedResultDtoOfNameValueDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

export interface ICommonLookupModalOptions {
    title?: string;
    isFilterEnabled?: boolean;
    dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
    canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
    loadOnStartup?: boolean;
    pageSize?: number;
}

//For more modal options http://valor-software.com/ngx-bootstrap/#/modals#modal-directive

@Component({
    selector: 'commonLookupModal',
    templateUrl: './common-lookup-modal.component.html'
})
export class CommonLookupModalComponent extends AppComponentBase {

    static defaultOptions: ICommonLookupModalOptions = {
        dataSource: undefined,
        canSelect: () => true,
        loadOnStartup: true,
        isFilterEnabled: true,
        pageSize: AppConsts.grid.defaultPageSize
    };

    @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();

    @ViewChild('modal', {static: true}) modal: ModalDirective;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    options: ICommonLookupModalOptions = _.merge({});

    isShown = false;
    isInitialized = false;
    filterText = '';
    excludeCurrentUser = false;
    tenantId?: number;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    configure(options: ICommonLookupModalOptions): void {
        this.options = _.merge({}, CommonLookupModalComponent.defaultOptions, { title: this.l('SelectAnItem') }, options);
    }

    show(): void {
        if (!this.options) {
            throw Error('Should call CommonLookupModalComponent.configure once before CommonLookupModalComponent.show!');
        }

        this.modal.show();
    }

    refreshTable(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.modal.hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event?: LazyLoadEvent): void {
        if (!this.isShown) {
            return;
        }

        if (!this.options.loadOnStartup && !this.isInitialized) {
            return;
        }

        this.getRecords(event);
        this.isInitialized = true;
    }

    getRecords(event?: LazyLoadEvent): void {
        const maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        const skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this.options
            .dataSource(skipCount, maxResultCount, this.filterText, this.tenantId)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    selectItem(item: NameValueDto) {
        const boolOrPromise = this.options.canSelect(item);
        if (!boolOrPromise) {
            return;
        }

        if (boolOrPromise === true) {
            this.itemSelected.emit(item);
            this.close();
            return;
        }

        //assume as observable
        (boolOrPromise as Observable<boolean>)
            .subscribe(result => {
                if (result) {
                    this.itemSelected.emit(item);
                    this.close();
                }
            });
    }
}
