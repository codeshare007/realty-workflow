import { Component, EventEmitter, HostBinding, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MoveDirection, MoveRecommendedListingInput, PagedResultDtoOfRecommendedListingListDto, RecommendedListingListDto, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { isEmpty, trim } from 'lodash';
import * as moment from 'moment';
import { LazyLoadEvent, Table } from 'primeng';
import { LeadListingTitlePipe } from '../components/lead-listing-detail/pipes/lead-listing-title.pipe';
import { LeadListingDetailService } from '../components/lead-listing-detail/services/lead-listing-detail.service';
import { LeadToTransactionModalComponent } from './modals/lead-to-transaction-modal/lead-to-transaction-modal.component';

@Component({
    selector: 'recommended-listings',
    templateUrl: './recommended-listings.component.html',
    animations: [accountModuleAnimation()]
})
export class RecommendedListingsComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.recommended-listings') class = true;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('leadToTransactionModal') leadToTransactionModal: LeadToTransactionModalComponent;

    @Input() leadId: string;

    @Output() recommendListingIdsChanged = new EventEmitter<string[]>();

    constructor(
        injector: Injector,
        private _recommendedListingService: RecommendedListingServiceProxy,
        private _router: Router,
        private _leadListingDetailService: LeadListingDetailService

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
        this._leadListingDetailService.listingResposeId = undefined;
        this._leadListingDetailService.showDetail = false;
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

    public selectItem(item: RecommendedListingListDto): void {
        this._leadListingDetailService.showDetail = true;
        this._leadListingDetailService.listingResposeId = item.id;
        this._leadListingDetailService.yGlId = false;
    }

    public actions(record: PagedResultDtoOfRecommendedListingListDto): UiTableActionItem[] {
        return this.actionsList;
    }

    public selectOption(element: { item: UiTableActionItem, id: string }, record: RecommendedListingListDto): void {
        switch (element.item.name) {
            case this.l('Up'):
            case this.l('Down'): {
                let input = new MoveRecommendedListingInput();
                input.id = element.id;
                input.direction = element.item.name === this.l('Up') ? MoveDirection.Up : MoveDirection.Down;

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

                this.leadToTransactionModal.show(this.getListingAddress(record), undefined, element.id);
                break;
        }
    }

    getListingAddress(record: RecommendedListingListDto) {
        const street = `${this._getValue(record.streetNumber)} ${this._getValue(record.streetName)}`;
        const unit = `${this._getValue(record.unit)}`;
        const unitHash = unit ? `#${unit}` : '';
        const city = `${this._getValue(record.city)}`;
        const state = `${this._getValue(record.state)} ${this._getValue(record.zip)}`;
        const listTitle = [street, unitHash, city, state];
        const solution = listTitle.filter((item) => !isEmpty(trim(item))).join(', ');

        return solution.length ? solution : '-';
    }

    private _getValue(value): string {
        return value ? value : '';
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }
}
