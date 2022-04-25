import { Pipe, PipeTransform } from '@angular/core';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

@Pipe({
    name: 'layerLabel'
})
export class LayerLabelPipe implements PipeTransform {
    transform(layer: ControlLayer): string {
        if (!isNumber(layer)) { return; }

        switch (layer) {
            case ControlLayer.Library:
                return 'Library';
            case ControlLayer.Transaction:
                return 'Transaction';
            case ControlLayer.Signing:
                return 'Signing';
        }
    }
}
