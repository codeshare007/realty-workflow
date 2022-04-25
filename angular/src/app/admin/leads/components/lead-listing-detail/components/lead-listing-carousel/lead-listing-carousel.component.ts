import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ListingVideoImage } from '../../models/lead-listing.model';

@Component({
    selector: 'lead-listing-carousel',
    templateUrl: './lead-listing-carousel.component.html'
})
export class LeadListingCarouselComponent {

    @HostBinding('class.lead-listing-carousel') class = true;

    @Input() items: ListingVideoImage[];

    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

    public close() {
        this.onClose.emit();
    }
}
