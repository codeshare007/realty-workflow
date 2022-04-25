import { Pipe, PipeTransform } from '@angular/core';
import { SwitchLayer } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';

@Pipe({
    name: 'switchLayersOrder'
})
export class SwitchLayersOrderPipe implements PipeTransform {
    transform(layers: SwitchLayer[]): SwitchLayer[] {
        if (!layers.length) { return; }

        const mainIndex = layers.findIndex((layer) => layer.layer === ControlLayer.Signing);
        if (mainIndex !== -1) {
            const main = cloneDeep(layers[mainIndex]);
            layers.splice(mainIndex, 1);
            layers.unshift(main);
        } else {

            return layers;
        }

        return layers;
    }
}
