import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'leadListingBads' })
export class LeadListingBadsPipe implements PipeTransform {

    transform(value: string): any {
        if (!value) { return '-'; }

        return value.split('.')[0];
    }
}
