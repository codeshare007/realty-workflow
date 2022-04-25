import { Pipe, PipeTransform } from '@angular/core';
import { ReminderFrequencyTypeToNameService } from '../services/reminder-frequency-type-to-name.service';

@Pipe({
    name: 'reminderFrequency'
})
export class ReminderFrequencyTypePipe implements PipeTransform {

    constructor(
        private _reminderFrequencyTypeToNameService: ReminderFrequencyTypeToNameService) {
    }

    transform(reminderFrequency: number): boolean {
        return this._reminderFrequencyTypeToNameService.getName(reminderFrequency);
    }
}
