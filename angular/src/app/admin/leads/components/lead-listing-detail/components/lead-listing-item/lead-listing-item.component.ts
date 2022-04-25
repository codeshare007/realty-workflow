import { Component, Input } from '@angular/core';

@Component({
    selector: 'lead-listing-item',
    templateUrl: './lead-listing-item.component.html'
})
export class LeadListingItemComponent {

    @Input() title = '';
    @Input() description = '';
    @Input() tags: string[] = [];
}
