import { Component, Input } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { RecommendedPublicListingDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'listing-header',
    templateUrl: './listing-header.component.html'
})
export class ListingHeaderComponent {
    @Input() recommendedListing: RecommendedPublicListingDto;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    
    constructor() { }
}
