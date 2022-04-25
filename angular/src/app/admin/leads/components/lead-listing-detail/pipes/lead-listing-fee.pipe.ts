import { Pipe, PipeTransform } from '@angular/core';
import { isNaN } from 'lodash';
import { FeeType } from '../models/lead-listing.model';

@Pipe({ name: 'leadListingFee' })
export class LeadListingFeePipe implements PipeTransform {


    transform(value: string): string {
        if (!value) { return '-'; }

        if (value.length > 0 && !isNaN(Number(value))) {
            switch (+value) {
                case FeeType.NoFeePaid:
                    return 'No Fee Paid';
                default:
                    return this._convertToPercentage(+value);
            }
        } else {
            return value;
        }
    }

    private _convertToPercentage(value: number): string {
        return `${value * 100}%`;
    }
}
