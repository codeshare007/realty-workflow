import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostBinding, Injector, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { GetAllFormsInput, IHasFormListDto, TableDocument } from '../models/table-documents.model';
// import { FormsLibraryService } from '../services/forms-library.service';

@Component({
    selector: 'forms-table',
    templateUrl: './forms-table.component.html'
})
export class FormsTableComponent extends AppComponentBase implements AfterViewInit, OnChanges {

    @HostBinding('class.forms-library-table') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() items: IHasFormListDto[];
    @Input() totalCount: number;
    @Output() onGetAll = new EventEmitter<GetAllFormsInput>();
    @Output() onEdit = new EventEmitter<number>();
    @Output() onDelete = new EventEmitter<number>();
    @Output() onPreview = new EventEmitter<number>();
    @Output() onDownload = new EventEmitter<number>();
    @Output() onDuplicate = new EventEmitter<number>();

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        public _zone: NgZone
    ) {
        super(injector);
    }

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Preview')),
        new UiTableActionItem(this.l('Download')),
        new UiTableActionItem(this.l('Delete')),
        new UiTableActionItem(this.l('Edit_Form')),
        new UiTableActionItem(this.l('Duplicate')),
    ];

    loading = true;

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    ngOnChanges({ items, totalCount }: SimpleChanges): void {
        if ((items && items.currentValue !== items.previousValue) ||
            (totalCount && totalCount.currentValue !== totalCount.previousValue)) {
            this.loading = false;
            this.primengTableHelper.records = this.items;
            this.primengTableHelper.totalRecordsCount = this.totalCount;
        }
    }

    public getFileImage(contentType: string): string {
        if (contentType === 'application/pdf') {
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlFv7EqkPGH1X07zzZqDMdNFSQpI_YKtGB6w&usqp=CAU';
        }
        return '';
    }

    public getListings(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.loading = true;

        this.onGetAll.emit(new GetAllFormsInput(
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ));

        this._cdk.detectChanges();
    }

    public actions(record: TableDocument): UiTableActionItem[] {

        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: number }): void {
        switch (element.item.name) {
            case this.l('Edit_Form'):
                this.onEdit.emit(element.id);
                break;
            case this.l('Delete'):
                this.onDelete.emit(element.id);
                break;
            case this.l('Download'):
                this.onDownload.emit(element.id);
                break;
            case this.l('Preview'):
                this.onPreview.emit(element.id);
                break;
            case this.l('Duplicate'):
                this.onDuplicate.emit(element.id);
                break;
        }
    }
}
