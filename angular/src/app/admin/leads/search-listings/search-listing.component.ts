import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { CheckListItem } from '@app/admin/shared/general-combo.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetListingInput, ListingResposeDto, ListingServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListingCities } from '../listing.cities';

@Component({
    selector: 'search-listings',
    templateUrl: './search-listing.component.html',
    styleUrls: ['search-listing.component.less']
})
export class SearchListingComponent extends AppComponentBase implements OnInit {
    @Input() selectedListingIds: Array<string>;
    @Output() selectedListingIdsChange = new EventEmitter<string[]>();

    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('citiesFilterInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    cities = ListingCities.cities;
    input: GetListingInput = new GetListingInput();
    citiesShown: boolean;
    advancedFiltersAreShown: boolean;
    saving: boolean;
    active: boolean;
    cityCtrl = new FormControl();
    filteredCities: Observable<string[]>;
    selectedCities: string[] = [];
    citiesStrings: string[];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    citiefFilters: CheckListItem[] = [];
    petsFilters: CheckListItem[] = [new CheckListItem('cat', 'Cats Allowed', false), new CheckListItem('dog', 'Dogs Allowed', false)];
    mediaFilters: CheckListItem[] = [new CheckListItem('photos', 'Photos', false), new CheckListItem('tours', 'Virtual Tours', false)];
    statusFilters: CheckListItem[] = [new CheckListItem('ONMARKET', 'On Market', false), new CheckListItem('APP', 'Pending', false), new CheckListItem('OFFMARKET', 'Off Market', false)];

    constructor(
        injector: Injector,
        private _listingService: ListingServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        let array = new Array();

        for (var i in this.cities.items) {
            var subarray = Object.keys(this.cities.items[i]);
            array.push(...subarray);
        }

        this.citiefFilters = array.map(a => new CheckListItem(a, a, false));
        this.citiesStrings = array;
        this.filteredCities = this.cityCtrl.valueChanges.pipe(
            map((city: string | null) => city ? this._filter(city) : this.citiesStrings.slice()));
    }

    private _filter(value: string): string[] {
        console.log(value);
        const filterValue = value.toLowerCase();
        return this.citiesStrings.filter(city => city.toLowerCase().indexOf(filterValue) === 0);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.selectedCities.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.cityCtrl.setValue(null);
        console.log(event);
    }

    getListings(event?: LazyLoadEvent) {
        if (this.dataTable === undefined) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.input.pets = this.petsFilters.filter(a => a.checked).map(b => b.value);
        this.input.status = this.statusFilters.filter(a => a.checked).map(b => b.value);
        this.input.media = this.mediaFilters.filter(a => a.checked).map(b => b.value);
        this.input.sorting = this.primengTableHelper.getSorting(this.dataTable);
        this.input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this.input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this._listingService.getListing(this.input).subscribe(res => {
            this.primengTableHelper.records = res.listing.map(l => {
                l['isChecked'] = this.selectedListingIds && this.selectedListingIds.indexOf(l.id) >= 0;

                return l;
            });
            this.primengTableHelper.totalRecordsCount = res.totalCount;
        });
    }

    clearFilters() {
        this.input = new GetListingInput();
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }

    selectCity(event: MatAutocompleteSelectedEvent) {
        this.selectedCities.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.cityCtrl.setValue(null);
    }

    removeCity(city: any) {
        const index = this.selectedCities.indexOf(city);

        if (index >= 0) {
            this.selectedCities.splice(index, 1);
        }
    }

    onLisingSelectionToggle(record: ListingResposeDto) {
        this.selectedListingIds = this.selectedListingIds || new Array()

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
}
