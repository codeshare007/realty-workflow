import { Component, Input } from '@angular/core';
import { RecommendedPublicListingDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'listing-footer',
    templateUrl: './listing-footer.component.html'
})
export class ListingFooterComponent {
    @Input() recommendedListing: RecommendedPublicListingDto;
    
    constructor() { }
}
