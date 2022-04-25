import { Pipe, PipeTransform } from '@angular/core';
import { ViewMode } from '@app/shared/components/forms-library/models/table-documents.model';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';

@Pipe({
    name: 'selectToViewMode'
})
export class SelectToViewModePipe implements PipeTransform {
    transform(modes: ViewMode[]): SelectItem[] {
        if (!modes.length) { return; }

        return modes.map((mode, index) => new SelectItem(mode.title, index + '', mode));
    }
}
