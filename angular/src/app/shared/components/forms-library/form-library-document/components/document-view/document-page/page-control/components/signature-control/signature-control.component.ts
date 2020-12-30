import { Component, HostBinding, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SignatureControlService } from './services/signature-control.service';

@Component({
    selector: 'signature-control',
    templateUrl: './signature-control.component.html',
})
export class SignatureControlComponent extends AppComponentBase {

    @HostBinding('class.signature-control') class = true;

    constructor(
        injector: Injector,
        private _signatureControlService: SignatureControlService,
    ) {
        super(injector);
    }


    public onModalShow(): void {
        this._signatureControlService.setSignatureStateChange(true);
    }
}
