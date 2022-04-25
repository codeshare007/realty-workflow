import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from '../../ui-select/models/ui-select.model';

@Pipe({
    name: 'uiMultiSelect'
})
export class UiMultiSelectPipe implements PipeTransform {
    transform(value: string[]): SelectItem[] {
        if (!value) { return; }

        const solution = value.map((item, index) => {
            return new SelectItem(item, 'id-select-item__' + index, undefined);
        });

        return solution;
    }
}
