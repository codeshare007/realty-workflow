import { Component, Input } from '@angular/core';

@Component({
    selector: 'listing-features',
    templateUrl: './listing-features.component.html'
})
export class ListingFeaturesComponent {

    @Input() features: string[] = [];

    constructor() { }
}
