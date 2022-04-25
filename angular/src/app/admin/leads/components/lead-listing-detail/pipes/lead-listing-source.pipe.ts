import { Pipe, PipeTransform } from '@angular/core';
import { SourceInternal } from '../models/lead-listing.model';

@Pipe({ name: 'leadListingSource' })
export class LeadListingSourcePipe implements PipeTransform {

    transform(value: number): string {
        if (!value) { return '-'; }

        switch (value) {
            case SourceInternal.Internal:
                return 'Internal';
            case SourceInternal.NoInternal:
                return 'Not include Internal';
        }
    }
}
