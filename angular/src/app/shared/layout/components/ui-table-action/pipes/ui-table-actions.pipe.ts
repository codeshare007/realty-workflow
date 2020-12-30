import { Pipe, PipeTransform } from '@angular/core';
import { UiTableActionItem } from '../models/ui-table-action.model';

@Pipe({
    name: 'uiTableActionsFilter'
})
export class UiTableActionsPipe implements PipeTransform {
    transform(value: UiTableActionItem[]): UiTableActionItem[] {
        if (!value) { return; }
        const solution = value.filter((item) => {
            return item.available;
        });

        return solution;
    }
}
