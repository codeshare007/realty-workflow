import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MoveDirection, MoveRecommendedListingInput, PagedResultDtoOfRecommendedListingListDto, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { LazyLoadEvent, Table } from 'primeng';

@Component({
    selector: 'recommended-listings',
    templateUrl: './recommended-listings.component.html',
    styleUrls: ['./recommended-listings.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class RecommendedListingsComponent extends AppComponentBase implements OnInit {
    @Input() leadId: string;
    @Output() recommendListingIdsChanged = new EventEmitter<string[]>();
    @ViewChild('dataTable', { static: true }) dataTable: Table;

    constructor(
        injector: Injector,
        private _recommendedListingService: RecommendedListingServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    actionsList: UiTableActionItem[] = [
        new UiTableActionItem(this.l('Up')),
        new UiTableActionItem(this.l('Down')),
        new UiTableActionItem(this.l('CreateTransaction')),
        new UiTableActionItem(this.l('Delete')),
    ];

    ngOnInit(): void {
    }

    getItems(event?: LazyLoadEvent) {
        this._recommendedListingService.getList(
            null,
            this.leadId,
            this.primengTableHelper.getSorting(this.dataTable),
            100,
            0).subscribe(res => {
            this.primengTableHelper.records = res.items;
            this.primengTableHelper.totalRecordsCount = res.totalCount;

            this.recommendListingIdsChanged.emit(res.items.map(r => r.yglListingId));
        });
    }

    public actions(record: PagedResultDtoOfRecommendedListingListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }): void {
        switch (element.item.name) {
            case this.l('Up'):
            case this.l('Down'): {
                let input = new MoveRecommendedListingInput();
                input.id = element.id;
                input.direction = element.item.name == this.l('Up') ? MoveDirection.Up : MoveDirection.Down;

                this._recommendedListingService.move(input).subscribe(transactionId => {
                    this.getItems();
                });
            } break;
            case this.l('Delete'):
                this._recommendedListingService.delete(element.id).subscribe(transactionId => {
                    this.getItems();
                });
                break;
            case this.l('CreateTransaction'):
                this._recommendedListingService.createTransaction(element.id).subscribe(transactionId => {
                    console.log(transactionId);
                    this._router.navigate(['app/admin/transaction', transactionId]);
                });
                break;
        }
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }
}
