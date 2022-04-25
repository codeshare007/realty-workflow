import { AfterViewInit, Component, EventEmitter, HostBinding, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetListingInput, LeadEditDto, ListingListResponse, ListingResposeDto, ListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { LeadListingDetailService } from '../components/lead-listing-detail/services/lead-listing-detail.service';

@Component({
    selector: 'search-listings',
    templateUrl: './search-listing.component.html',
})
export class SearchListingComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {

    @HostBinding('class.search-listings') class = true;

    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    @Input() selectedListingIds: Array<string>;
    @Input() cloneLead: LeadEditDto = new LeadEditDto();

    @Output() selectedListingIdsChange = new EventEmitter<string[]>();

    input: GetListingInput = new GetListingInput();
    lead: LeadEditDto = new LeadEditDto();
    availableFrom!: moment.Moment | undefined;
    availableTo!: moment.Moment | undefined;
    advancedFiltersAreShown = true;
    // petsFilters: CheckListItem[] = [new CheckListItem('cat', 'Cats Allowed', false), new CheckListItem('dog', 'Dogs Allowed', false)];
    // mediaFilters: CheckListItem[] = [new CheckListItem('photos', 'Photos', false), new CheckListItem('tours', 'Virtual Tours', false)];
    // statusFilters: CheckListItem[] = [new CheckListItem('ONMARKET', 'On Market', false), new CheckListItem('APP', 'Pending', false), new CheckListItem('OFFMARKET', 'Off Market', false)];

    constructor(
        injector: Injector,
        private _listingService: ListingServiceProxy,
        private _leadListingDetailService: LeadListingDetailService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cloneLead && this.cloneLead) {
            this.lead = cloneDeep(this.cloneLead);
            this.getListings(undefined);
        }
    }

    ngOnInit(): void {
        this._leadListingDetailService.listingResposeId = undefined;
        this._leadListingDetailService.showDetail = false;
        this.advancedFiltersAreShown = true;
    }

    ngAfterViewInit(): void {
        this.getListings(undefined);
    }

    public selectItem(item: ListingResposeDto): void {
        this._leadListingDetailService.showDetail = true;
        this._leadListingDetailService.listingResposeId = item.id;
        this._leadListingDetailService.yGlId = true;
    }

    public getListings(event?: LazyLoadEvent): void {
        if (this.dataTable === undefined) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        const input = this._setInput();
        input.sorting = this.primengTableHelper.getSorting(this.dataTable);
        input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this._listingService.getListing(input)
            .subscribe((result: ListingListResponse) => {
                this.primengTableHelper.records = [];
                this.primengTableHelper.records = result.listing
                    ? result.listing.map((item) => {
                        item['isChecked'] = this.selectedListingIds
                            && this.selectedListingIds.indexOf(item.id) >= 0;

                        return item;
                    })
                    : [];

                this.primengTableHelper.totalRecordsCount = result.totalCount;
            });
    }

    public clearFilters(): void {
        this.input = new GetListingInput();
        this.lead.streetName = '';
        this.lead.streetNumber = '';
        this.lead.cities = [];
        this.lead.bathrooms = [];
        this.lead.bedrooms = [];
        this.lead.minRent = undefined;
        this.lead.maxRent = undefined;
        this.lead.zip = undefined;
        this.lead.moveFrom = undefined;
        this.lead.moveTo = undefined;

        this.getListings();
    }

    public fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }

    public onLisingSelectionToggle(record: ListingResposeDto): void {
        this.selectedListingIds = this.selectedListingIds || new Array();

        if (record['isChecked'] === true) {
            const index = this.selectedListingIds.indexOf(record.id, 0);
            if (index > -1) {
                this.selectedListingIds.splice(index, 1);
            }
        } else {
            this.selectedListingIds.push(record.id);
        }

        record['isChecked'] = !record['isChecked'];
        this.selectedListingIdsChange.emit(this.selectedListingIds);
    }

    private _setInput(): GetListingInput {
        const input = new GetListingInput();
        input.pets = this.lead.pets;
        input.zip = this.lead.zip;
        input.streetName = this.lead.streetName;
        input.bathrooms = this.lead.bathrooms;
        input.bedrooms = this.lead.bedrooms;
        input.cities = this.lead.cities;
        input.minimalRent = this.lead.minRent;
        input.streetNumber = this.lead.streetNumber;
        input.maximalRent = this.lead.maxRent;
        input.availableFrom = this.lead.moveFrom;
        input.availableTo = this.lead.moveTo;

        return input;
    }
}
