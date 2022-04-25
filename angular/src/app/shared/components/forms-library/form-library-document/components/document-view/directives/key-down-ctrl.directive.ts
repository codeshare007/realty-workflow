import { Directive, HostListener, Input } from '@angular/core';
import { KEY_CODE } from '@app/shared/components/forms-library/models/table-documents.model';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { ControlLayer } from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[keyDownCtrl]'
})
export class KeyDownCtrlDirective {

    @Input() mainLayer: ControlLayer;

    constructor(
        private _multiSelectControlsService: MultiSelectControlsService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownCtrl(event: KeyboardEvent) {
        const ctrl = event.getModifierState && event.getModifierState(KEY_CODE.CONTROL);

        if (!ctrl) { return; }

        switch (event.key) {
            case KEY_CODE.UP_ARROW:
                this._multiSelectControlsService
                    .editControlPosition(KEY_CODE.UP_ARROW, this.mainLayer);
                break;
            case KEY_CODE.RIGHT_ARROW:
                this._multiSelectControlsService
                    .editControlPosition(KEY_CODE.RIGHT_ARROW, this.mainLayer);
                break;
            case KEY_CODE.DOWN_ARROW:
                this._multiSelectControlsService
                    .editControlPosition(KEY_CODE.DOWN_ARROW, this.mainLayer);
                break;
            case KEY_CODE.LEFT_ARROW:
                this._multiSelectControlsService
                    .editControlPosition(KEY_CODE.LEFT_ARROW, this.mainLayer);
                break;
        }
    }
}
