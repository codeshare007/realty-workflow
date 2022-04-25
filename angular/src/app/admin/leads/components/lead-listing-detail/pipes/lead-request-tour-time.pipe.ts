import { Pipe, PipeTransform } from '@angular/core';
import { RequestTourTime } from '@shared/service-proxies/service-proxies';
import { SourceInternal } from '../models/lead-listing.model';

@Pipe({ name: 'leadRequestTourTime' })
export class LeadRequestTourTimePipe implements PipeTransform {

    transform(value: number): string {
        if (!value) { return '-'; }

        switch (value) {
            case RequestTourTime.Morning:
            return 'Morning';
            case RequestTourTime.Afternoon:
            return 'Afternoon';
            case RequestTourTime.Evening:
            return 'Evening';
        }
    }
}
