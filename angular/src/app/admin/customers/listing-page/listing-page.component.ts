import { Component, Injector, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ListingResposeDto } from '@shared/service-proxies/service-proxies';


@Component({
    templateUrl: './listing-page.component.html',
    styleUrls: ['./listing-page.component.less'],
    // encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()],
    selector: 'listing-page'
})
export class ListingPage extends AppComponentBase implements OnInit {
    @Input('selectedListing') selectedListing: ListingResposeDto
    urlVirtualTourString: SafeResourceUrl;
    rentIncludesString: string;

    ngOnInit(): void {
        this.rentIncludesString = this.selectedListing.rentInclude && this.selectedListing.rentInclude.length > 1 ? this.selectedListing.rentInclude.join(', ') : this.selectedListing.rentInclude ? this.selectedListing.rentInclude[0] : '--'
        this.urlVirtualTourString = this.selectedListing.virtualTour && this.selectedListing.virtualTour.length > 0 ? this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedListing.virtualTour[0]) : undefined;

    }

    constructor(
        injector: Injector,
        public sanitizer: DomSanitizer
    ) {
        super(injector);

    }
}
