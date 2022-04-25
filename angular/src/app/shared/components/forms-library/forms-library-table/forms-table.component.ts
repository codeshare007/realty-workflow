import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostBinding, Injector, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormDisplayOrderInput, FormStatus, SigningFormServiceProxy, UpdateSigningFormsOrderInput } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { GetAllFormsInput, IHasFormListDto } from '../models/table-documents.model';
// import { FormsLibraryService } from '../services/forms-library.service';

export class FormsTableOptions {
    constructor(
        public showEditAction: boolean,
        public showDeleteAction: boolean,
        public showPreviewAction: boolean,
        public showSelectAction: boolean,
        public showMultiSelect = false
    ) { }
}

@Component({
    selector: 'forms-table',
    templateUrl: './forms-table.component.html'
})
export class FormsTableComponent extends AppComponentBase implements AfterViewInit, OnChanges, OnDestroy {

    @HostBinding('class.forms-library-table') class = true;

    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    @Input() dndEnabled: boolean;
    @Input() items: IHasFormListDto[];
    @Input() totalCount: number;
    @Input() options: FormsTableOptions;
    @Input() allowEdit = true;
    @Input() signingCompleted: boolean;
    @Input() signingId: string;
    @Input() showDownloadOriginal = false;
    @Input() doNotShowMulti = false;

    @Input() selectedIds: string[];
    @Output() selectedIdsChange = new EventEmitter<string[]>();

    @Output() onGetAll = new EventEmitter<GetAllFormsInput>();
    @Output() onEdit = new EventEmitter<string>();
    @Output() onDelete = new EventEmitter<IHasFormListDto>();
    @Output() onSelect = new EventEmitter<string>();
    @Output() onSelectMany = new EventEmitter<string[]>();
    @Output() onPreview = new EventEmitter<string>();
    @Output() onDownload = new EventEmitter<string>();
    @Output() onDuplicate = new EventEmitter<string>();
    @Output() onDownloadOriginalDocument = new EventEmitter<IHasFormListDto>();
    @Output() onDownloadSignedDocument = new EventEmitter<IHasFormListDto>();

    loading = true;
    active = false;

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _router: Router,
        private _signingFormServiceProxy: SigningFormServiceProxy,
        public _zone: NgZone
    ) {
        super(injector);
    }

    // loading = true;

    ngAfterViewInit(): void {
        this.active = true;
        this.getListings();
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    ngOnChanges({ items, totalCount }: SimpleChanges): void {
        if ((items && items.currentValue !== items.previousValue) ||
            (totalCount && totalCount.currentValue !== totalCount.previousValue)) {
            // this.loading = false;
            this.primengTableHelper.records = this.items;
            this.primengTableHelper.totalRecordsCount = this.totalCount;
        }
    }

    ngOnDestroy() {
        this.loading = true;
        this.active = false;
    }

    onSelectionToggle(record: IHasFormListDto) {
        this.selectedIds = this.selectedIds || new Array();

        if (record['isChecked'] === true) {
            const index = this.selectedIds.indexOf(record.form.id, 0);
            if (index > -1) {
                this.selectedIds.splice(index, 1);
            }
        } else {
            this.selectedIds.push(record.form.id);
        }

        record['isChecked'] = !record['isChecked'];
        this.selectedIdsChange.emit(this.selectedIds);
    }

    public selectMulti() {
        this.onSelectMany.emit(this.selectedIds);
        this.selectedIds = [];
    }

    public getFileImage(contentType: string): string {
        if (contentType === 'application/pdf') {
            return './assets/common/images/pdf.svg';
        }
        return '';
    }

    public getListings(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        if (this.active) {
            this.onGetAll.emit(
                new GetAllFormsInput(
                    this.primengTableHelper.getSorting(this.dataTable),
                    this.primengTableHelper.getMaxResultCount(this.paginator, event),
                    this.primengTableHelper.getSkipCount(this.paginator, event)
                )
            );
            this.loading = false;
            this._cdk.detectChanges();
        }
    }

    public editForm(record: IHasFormListDto): void {
        if (!this.allowEdit) { return; }

        this.onEdit.emit(record.form.id);
    }

    public selectForm(record: IHasFormListDto): void {
        this.onSelect.emit(record.form.id);
    }

    public deleteForm(record: IHasFormListDto): void {
        this.onDelete.emit(record);
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

    public drop(event: CdkDragDrop<any>) {
        if (!this.signingId) { return; }

        moveItemInArray(this.primengTableHelper.records, event.previousIndex, event.currentIndex);
        this._updateSigningFormsOrder();
    }

    private _updateSigningFormsOrder(): void {
        const input: UpdateSigningFormsOrderInput = new UpdateSigningFormsOrderInput();
        input.id = this.signingId;
        input.forms = this._mapFormDisplayInput();
        this._signingFormServiceProxy.updateSigningFormsOrder(input)
            .subscribe(() => { });
    }

    private _mapFormDisplayInput(): FormDisplayOrderInput[] {
        return this.items.map((item: IHasFormListDto, index) => {
            const input: FormDisplayOrderInput = new FormDisplayOrderInput();
            input.id = item.form.id;
            input.displayOrder = index;

            return input;
        });
    }
}
