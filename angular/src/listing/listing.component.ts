import { Component, HostBinding, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListingVideoImage } from '@app/admin/leads/components/lead-listing-detail/models/lead-listing.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { RecommendedListingServiceProxy, RecommendedPublicListingDto } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './listing.component.html',
    animations: [accountModuleAnimation()],
})
export class ListingComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.listing') class = true;

    recommendedListing: RecommendedPublicListingDto;
    videos: ListingVideoImage[] = [];

    public constructor(
        injector: Injector,
        private _router: ActivatedRoute,
        private _recommendedListingService: RecommendedListingServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {

        this._router.params
            .pipe(
                takeUntil(this.onDestroy$),
            ).subscribe((params) => {
                const id = params['id'];
                // const id = '1c7c4dde-1d11-429e-be23-08d8ccea9bd5';
                // this._getPublicRecommendations();
                this._getRecommendation(id);
            });
    }

    private _setVideos(videos: string[]): void {
        if (videos && videos.length) {
            this.videos = videos.map((video, index) => {
                return new ListingVideoImage('video_' + index, video);
            });
        }
    }

    private _setImages(virtualTour: string[]): void {
        if (virtualTour && virtualTour.length) {
            const videos = virtualTour.map((video, index) => {
                if (video.includes('.jpg')) {
                    return new ListingVideoImage('images_' + index, video);
                } else {
                    return new ListingVideoImage('video_' + index, video);
                }
            });

            this.videos = this.videos.concat(...videos);
        }
    }

    // private _getPublicRecommendations(): void {
    //     const leadId = '19a718db-f79d-4cb6-5e95-08d8c9cce11c';
    //     this._recommendedListingService.getPublicRecommendationList(leadId)
    //         .subscribe((result) => {
    //             console.log('result: 1', result);
    //             // console.log('result: 2', result);
    //             this._getRecommendation(result[0].id);
    //         });
    // }

    private _getRecommendation(id: string): void {
        this._recommendedListingService.getPublicRecommendation(id)
            .subscribe((result: RecommendedPublicListingDto) => {
                this.recommendedListing = result;
                this._setVideos(this.recommendedListing.listing.video);
                this._setImages(this.recommendedListing.listing.virtualTour);
                this._setImages(this.recommendedListing.listing.photo);
            });
    }
}
