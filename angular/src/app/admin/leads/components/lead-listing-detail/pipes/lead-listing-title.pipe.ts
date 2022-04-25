import { Pipe, PipeTransform } from '@angular/core';
import { ListingDto } from '@shared/service-proxies/service-proxies';
import { isEmpty, trim } from 'lodash';

@Pipe({ name: 'leadListingTitle' })
export class LeadListingTitlePipe implements PipeTransform {

    transform(leadListing: ListingDto): string {
        if (!leadListing) { return '-'; }

        const street = `${this._getValue(leadListing.streetNumber)} ${this._getValue(leadListing.streetName)}`;
        const unit = `${this._getValue(leadListing.unit)}`;
        const unitHash = unit ? `#${unit}` : '';
        const city = `${this._getValue(leadListing.city)}`;
        const state = `${this._getValue(leadListing.state)} ${this._getValue(leadListing.zip)}`;
        const listTitle = [street, unitHash, city, state];
        const solution = listTitle.filter((item) => !isEmpty(trim(item))).join(', ');

        return solution.length ? solution : '-';
    }

    private _getValue(value): string {
        return value ? value : '';
    }
}
