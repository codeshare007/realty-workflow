import { Directive, HostListener } from '@angular/core';
import { KEY_CODE } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlCopyPasteService } from '@app/shared/components/forms-library/services/control-copy-paste.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { MacKeysService } from '../services/mac-keys.service';

@Directive({
    selector: '[keyDownC]'
})
export class KeyDownCDirective {

    constructor(
        private _controlCopyPasteService: ControlCopyPasteService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _macKeysService: MacKeysService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownC(event: KeyboardEvent) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrl = event.getModifierState && event.getModifierState(KEY_CODE.CONTROL);

        if (isMac ? !this._macKeysService.macKeys.cmdKey : !ctrl) { return; }

        switch (event.key) {
            case KEY_CODE.KEY_C:
                if (this._multiSelectControlsService.multiControls.length) {
                    this._controlCopyPasteService.copiedControl = true;
                    this._controlCopyPasteService.multiControls = [
                        ...this._multiSelectControlsService.multiControls
                    ];
                }
                break;
        }
    }
}
