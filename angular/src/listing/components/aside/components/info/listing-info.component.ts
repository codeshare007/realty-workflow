import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PublicListingDto } from '@shared/service-proxies/service-proxies';
import { ListingInfo } from 'listing/models/listing.model';
import * as moment from 'moment';

@Component({
    selector: 'listing-info',
    templateUrl: './listing-info.component.html'
})
export class ListingInfoComponent implements OnChanges {

    @Input() listing: PublicListingDto;

    listingsInfo: ListingInfo[] = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.listing) {
            this._setListingInfo();
        }
    }

    private _setListingInfo(): void {
        const propertyId = new ListingInfo('Property ID', this.listing.yglID);
        const rent = new ListingInfo('Rent', `$${this.listing.price} / mo.`);
        const beds = new ListingInfo('Beds', `${this.listing.beds} Beds`);
        const baths = new ListingInfo('Baths', `${this.listing.baths} Baths`);
        const available = new ListingInfo('Available', moment(this.listing.availableDate).format('L'));
        const pet = new ListingInfo('Pet', this.listing.pet);
        const laundry = new ListingInfo('Laundry', this.listing.laundry);
        const squareFootage = new ListingInfo('Sq. Ft.', this.listing.squareFootage);
        const unitLevel = new ListingInfo('Unit Level', this.listing.unitLevel);
        //const parking = new ListingInfo('Parking', 'TEST');
        this.listingsInfo = [
            propertyId, rent, beds, baths, available, pet,
            laundry, squareFootage, unitLevel//, parking,
        ];
    }
}
