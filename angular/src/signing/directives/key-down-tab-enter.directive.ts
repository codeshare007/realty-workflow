import { Directive, HostListener } from '@angular/core';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { KEY_CODE, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { isNumber } from 'lodash';
import { SigningService } from 'signing/services/signing.service';

@Directive({
    selector: '[keyDownTabEnter]'
})
export class KeyDownTabEnterDirective {

    constructor(
        private _signingService: SigningService,
        private _controlDetailsService: ControlDetailsService,
    ) { }

    @HostListener('document:keydown', ['$event'])
    keydownTabEnter(event: KeyboardEvent) {
        if (!this._signingService.allowedChangeTab) { return; }

        if (event.key === KEY_CODE.ENTER || event.key === KEY_CODE.TAB) {
            if (!isNumber(this._signingService.focusStartedControl)) { return; }

            this._signingService.focusStartedControl++;

            if (this._signingService.focusStartedControl > this._signingService.tabIndexControls.length) {
                this._signingService.focusStartedControl = undefined;
                this._controlDetailsService.selectControlDetails(undefined, true);
            }
            this._signingService.setTabChange(TypeIndex.Tab);
        }
    }
}
