import { Directive, HostListener } from '@angular/core';
import { KEY_CODE } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlDeleteService } from '@app/shared/components/forms-library/services/control-delete.service';

@Directive({
    selector: '[keyDownDel]'
})
export class KeyDownDelDirective {

    constructor(
        private _controlDeleteService: ControlDeleteService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownC(event: KeyboardEvent) {
        switch (event.key) {
            case KEY_CODE.KEY_DEL:
                this._controlDeleteService.setCtrlDeleteControl(true);
                break;
        }
    }
}
