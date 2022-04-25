import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'leadListingDate' })
export class LeadListingDatePipe implements PipeTransform {

    transform(value: Date | moment.Moment, dateFormat: string): any {
        if (!value) { return '-'; }

        return moment(value).format(dateFormat);
    }
}
