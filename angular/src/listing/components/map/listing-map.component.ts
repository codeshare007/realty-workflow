import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'listing-map',
    templateUrl: './listing-map.component.html'
})
export class ListingMapComponent implements OnChanges {

    @Input() lat: string;
    @Input() long: string;

    googleMapUrl = 'https://maps.google.com/maps?q=';
    // test_api_key = 'AIzaSyDX4RyUYJ-6MtOChvWA7hmf1zC3FhEpPfs';

    constructor(
        private sanitizer: DomSanitizer
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.lat && this.long) {
            // this.googleMapUrl = `https://maps.google.com/maps?q=${this.lat},${this.long}&hl=es&z=14&amp&key=${this.test_api_key}&zoom=18;output=embed`;
            // this.googleMapUrl = `https://maps.google.com/maps/embed/v1/place?key=${ this.test_api_key }&q=${ this.lat },${ this.long }`;
            // this.googleMapUrl = `https://maps.google.com/maps?q='+YOUR_LAT+','+YOUR_LON+'&hl=es&z=14&amp;;output=embed`;
            this.googleMapUrl = `https://maps.google.com/maps?q=${this.lat}, ${this.long}&z=15&output=embed`;
            // console.log('this.googleMapUrl: ', this.googleMapUrl);
        }
    }

    public getSafeUrl(): SafeResourceUrl {

        // this.mapUrl = "https://maps.google.com/maps/embed/v1/place?key={{API-KEY}}&q="+this._auctionDetails.AuctionDetail.Latitude +","+this._auctionDetails.AuctionDetail.Longitude+"";

        return this.sanitizer.bypassSecurityTrustResourceUrl(this.googleMapUrl);
    }
}
