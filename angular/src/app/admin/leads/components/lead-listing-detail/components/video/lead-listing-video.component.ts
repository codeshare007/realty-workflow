import { Component, Input } from '@angular/core';
import { ListingVideoImage } from '../../models/lead-listing.model';

@Component({
    selector: 'lead-listing-video',
    templateUrl: './lead-listing-video.component.html'
})
export class LeadListingVideoComponent {

    @Input() items: ListingVideoImage[] = [];

    constructor(

    ) { }
}
