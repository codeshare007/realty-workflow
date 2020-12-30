import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { UiTableActionItem } from '@app/shared/layout/components/ui-table-action/models/ui-table-action.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { FormLibraryDocumentService } from '../services/form-library-document.service';


@Component({
    selector: 'form-layer',
    templateUrl: './form-layer.component.html',
})
export class FormLayerComponent {

    @HostBinding('class.form-layer') class = true;

    layerList: UiTableActionItem[] = [
        new UiTableActionItem('Form', ControlLayer.Form),
        new UiTableActionItem('Signing', ControlLayer.Signing),
    ];

    layer: ControlLayer;

    constructor(
        private _cdk: ChangeDetectorRef,
        private _formLibraryDocumentService: FormLibraryDocumentService,
    ) {
        this.layer = this._formLibraryDocumentService.layer;
    }

    public selectLayer(event: UiTableActionItem): void {
        this._formLibraryDocumentService.setLayerChange(event.type);
        this.layer = event.type;
    }
}
