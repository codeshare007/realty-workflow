import { Pipe, PipeTransform } from '@angular/core';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { ViewModeSetting } from '../models/table-documents.model';

@Pipe({
    name: 'filterModeSitting'
})
export class FilterModeSettingPipe implements PipeTransform {
    transform(modes: ViewModeSetting[], layer: ControlLayer): ViewModeSetting[] {
        if (!modes.length) { return; }

        return modes.filter((mode) => mode.layer === layer);
    }
}
