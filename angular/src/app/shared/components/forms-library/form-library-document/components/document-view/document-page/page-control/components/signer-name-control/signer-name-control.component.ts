import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'signer-name-control',
    templateUrl: './signer-name-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignerNameControlComponent {

    @HostBinding('class.signer-name-control') class = true;

    @Input() signerName: ControlEditDto;
}
