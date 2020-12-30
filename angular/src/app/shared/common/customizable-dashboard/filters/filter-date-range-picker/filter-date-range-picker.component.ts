import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-filter-date-range-picker',
  templateUrl: './filter-date-range-picker.component.html',
  styleUrls: ['./filter-date-range-picker.component.css']
})
export class FilterDateRangePickerComponent extends AppComponentBase {

  date: Date;
  selectedDateRange: moment.Moment[] = [moment().add(-7, 'days').startOf('day'), moment().endOf('day')];
  constructor(injector: Injector) {
    super(injector);
  }

  onChange() {
    abp.event.trigger('app.dashboardFilters.dateRangePicker.onDateChange', this.selectedDateRange);
  }
}
