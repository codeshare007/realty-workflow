import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ListingVideoImage } from '@app/admin/leads/components/lead-listing-detail/models/lead-listing.model';

@Component({
    selector: 'listing-video',
    templateUrl: './listing-video.component.html'
})
export class ListingVideoComponent {

    @Input() items: ListingVideoImage[] = [];

    test = 'https://s3.amazonaws.com/ygl-photos/66W5ec723d9ef3a3.jpg';

    constructor(
        private _sanitizer: DomSanitizer,
    ) { }

    public getSecurityUrl(url: string): SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public isVideo(value: string): boolean {
        return value.includes('video_');
    }
}
