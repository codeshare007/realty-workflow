import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloadSigningAttachmentInput, EntityDtoOfGuid, SigningServiceProxy, TransactionAttachmentListDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { isUndefined } from 'lodash';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Subject } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';

@Component({
    selector: 'signing-attachments-table',
    templateUrl: './signing-attachments-table.component.html',
    animations: [accountModuleAnimation()]
})
export class SigningAttachmentsTableComponent extends AppComponentBase implements OnInit, OnDestroy {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Input() signingId: string;

    active = false;
    loading = false;

    public filterTextSubject: Subject<string> = new Subject<string>();

    filter = {
        filterText: '',
    };

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Download'))
    ];

    constructor(
        injector: Injector,
        private _signingService: SigningServiceProxy,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.filterTextSubject
            .pipe(debounceTime(500))
            .subscribe(filterText => {
                this.filter.filterText = filterText;
                this.getAttachments();
            });
    }

    ngOnDestroy(): void {
        this.filterTextSubject.complete();
    }

    getAttachments(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.loading = true;
        this._signingService
            .getAttachments(
                this.signingId,
                this.filter.filterText,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getMaxResultCount(this.paginator, event),
                this.primengTableHelper.getSkipCount(this.paginator, event))
            .pipe(finalize(() => this.loading = false))
            .subscribe(res => {
                this.primengTableHelper.records = res.items;
                this.primengTableHelper.totalRecordsCount = res.totalCount;
            });
    }

    public actions(record: TransactionAttachmentListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Download'):
                this._downloadAttachment(element.id);
                break;
        }
    }

    private _downloadAttachment(attachmentId: string): void {
        let attachment = this.primengTableHelper.records
            .filter(i => i.attachment.id === attachmentId)
            .map(i => i.attachment)[0];

        if (isUndefined(attachment)) { return; }

        const input = new DownloadSigningAttachmentInput();
        input.id = this.signingId;
        input.attachment = new EntityDtoOfGuid();
        input.attachment.id = attachmentId;

        this.loading = true;
        this._signingService.downloadAttachment(input)
            .pipe(finalize(() => this.loading = false))
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
}
