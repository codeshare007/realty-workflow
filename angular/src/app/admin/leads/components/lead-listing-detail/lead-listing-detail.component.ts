import { Component, HostBinding, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ListingDto, ListingServiceProxy, RecommendedListingDto, RecommendedListingServiceProxy } from '@shared/service-proxies/service-proxies';
import { LeadImagesModalComponent } from './modals/lead-images/lead-images-modal.component';
import { ListingVideoImage } from './models/lead-listing.model';
import { LeadListingDetailService } from './services/lead-listing-detail.service';

@Component({
    selector: 'lead-listing-detail',
    templateUrl: './lead-listing-detail.component.html',
})
export class LeadListingDetailComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.lead-listing-detail') class = true;

    @ViewChild('leadImagesModalRef') leadImagesModal: LeadImagesModalComponent;

    listing: ListingDto;
    videos: ListingVideoImage[] = [];
    recommendedListing: RecommendedListingDto;
    // listingDTO: ListingResposeDto;

    constructor(
        injector: Injector,
        private sanitizer: DomSanitizer,
        private _leadListingDetailService: LeadListingDetailService,
        private _listingServiceProxy: ListingServiceProxy,
        private _recommendedListingServiceProxy: RecommendedListingServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this._leadListingDetailService.listingResposeId) {
            this._getListing();
        }
    }

    ngOnDestroy(): void {
        this._leadListingDetailService.listingResposeId = undefined;
        this._leadListingDetailService.showDetail = false;
        this._leadListingDetailService.yGlId = false;
    }

    public openImagesModal(): void {
        this.leadImagesModal.show(this.listing.photo);
    }

    public getFirstImage(): string {
        if (this.listing.photo.length) {
            return this.listing.photo[0];
        }
    }


    public getTitle(): string {
        return `${this.listing.streetNumber}`;
    }

    private _getListing(): void {
        // '214836799'
        if (!this._leadListingDetailService.listingResposeId) { return; }

        if (this._leadListingDetailService.yGlId) {
            this._getYglListing();
        } else {
            this._getRecommendedListing();
        }
    }

    private _setVideos(): void {
        const videos = this.listing.video.map((item, index) => {
            return new ListingVideoImage('video_' + index, item);
        });
        const virtualTours = this.listing.virtualTour.map((item, index) => {
            return new ListingVideoImage('video_' + index, item);
        });
        this.videos = [...videos, ...virtualTours];
    }

    private _getYglListing(): void {
        //  214836799
        this._listingServiceProxy.getYglListing(this._leadListingDetailService.listingResposeId)
            .subscribe((result: ListingDto) => {
                this.listing = result;
                this._setVideos();
            });
    }

    private _getRecommendedListing(): void {
        this._recommendedListingServiceProxy.getRecommendedListing(this._leadListingDetailService.listingResposeId)
            .subscribe((result: RecommendedListingDto) => {
                this.recommendedListing = result;
                this.listing = this.recommendedListing.listing;
                this._setVideos();
            });
    }

    public goBack() {
        this._leadListingDetailService.showDetail = false;
        this._leadListingDetailService.listingResposeId = undefined;
        this._leadListingDetailService.yGlId = false;
    }
}
