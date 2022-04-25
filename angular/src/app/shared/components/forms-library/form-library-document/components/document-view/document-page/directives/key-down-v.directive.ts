import { Directive, HostListener } from '@angular/core';
import { KEY_CODE } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlCopyPasteService } from '@app/shared/components/forms-library/services/control-copy-paste.service';
import { MacKeysService } from '../services/mac-keys.service';

@Directive({
    selector: '[keyDownV]'
})
export class KeyDownVDirective {

    constructor(
        private _controlCopyPasteService: ControlCopyPasteService,
        private _macKeysService: MacKeysService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownV(event: KeyboardEvent) {
        const ctrl = event.getModifierState && event.getModifierState(KEY_CODE.CONTROL);
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        if (isMac ? !this._macKeysService.macKeys.cmdKey : !ctrl) { return; }

        switch (event.key) {
            case KEY_CODE.KEY_V:
                if (this._controlCopyPasteService.copiedControl) {
                    this._controlCopyPasteService.setCopyPasteControl(true);
                }
                break;
        }
    }
}
