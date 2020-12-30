import { Directive, Self, Output, EventEmitter, Input, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import compare from 'just-compare';

///this directive ensures that the date value will always be the moment.
@Directive({
    selector: '[datePickerMomentModifier]'
})
export class DatePickerMomentModifierDirective implements OnDestroy, OnChanges {
    @Input() date = new EventEmitter();
    @Output() dateChange = new EventEmitter();

    subscribe: Subscription;
    lastDate: Date = null;

    constructor(@Self() private bsDatepicker: BsDatepickerDirective) {
        this.subscribe = bsDatepicker.bsValueChange
            .subscribe((date: Date) => {
                if (!date) {
                    this.lastDate = null;
                    this.dateChange.emit(null);
                } else if ((date instanceof Date && !compare(this.lastDate, date) && date.toString() !== 'Invalid Date')) {
                    this.lastDate = date;
                    this.dateChange.emit(date);
                }
            });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

    ngOnChanges({ date }: SimpleChanges) {
        if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
            setTimeout(() => {
                this.bsDatepicker.bsValue = moment(date.currentValue).toDate();
            }, 0);
        } else {
            setTimeout(() => {
                this.bsDatepicker.bsValue = null;
            }, 0);
        }
    }
}
