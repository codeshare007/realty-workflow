import { Component, HostBinding } from '@angular/core';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'form-layer',
    templateUrl: './form-layer.component.html',
})
export class FormLayerComponent {

    @HostBinding('class.form-layer') class = true;

    layerList: UiTableActionItem[] = [
        new UiTableActionItem('Library', ControlLayer.Library),
        new UiTableActionItem('Transaction', ControlLayer.Transaction),
        new UiTableActionItem('Signing', ControlLayer.Signing),
    ];

    layer: ControlLayer;

    public selectLayer(event: UiTableActionItem): void {
        this.layer = event.type;
    }
}
