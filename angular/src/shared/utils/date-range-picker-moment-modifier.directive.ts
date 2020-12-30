import { Directive, Self, Output, EventEmitter, Input, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import compare from 'just-compare';

///this directive ensures that date values will always be the moment.
@Directive({
    selector: '[dateRangePickerMomentModifier]'
})
export class DateRangePickerMomentModifierDirective implements OnDestroy, OnChanges {
    @Input() date = new EventEmitter();
    @Output() dateChange = new EventEmitter();

    subscribe: Subscription;
    lastDates: Date[] = null;

    constructor(@Self() private bsDateRangepicker: BsDaterangepickerDirective) {
        this.subscribe = bsDateRangepicker.bsValueChange
            .pipe(filter(dates => !!(dates && dates[0] instanceof Date && dates[1] instanceof Date
                && !compare(this.lastDates, dates) && dates[0].toString() !== 'Invalid Date' && dates[1].toString() !== 'Invalid Date')))
            .subscribe((dates: Date[]) => {
                this.lastDates = dates;
                this.dateChange.emit([moment(dates[0]), moment(dates[1])]);
            });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

    ngOnChanges({ date }: SimpleChanges) {
        if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
            setTimeout(() => this.bsDateRangepicker.bsValue = [new Date(date.currentValue[0]), new Date(date.currentValue[1])], 0);
        }
    }
}
