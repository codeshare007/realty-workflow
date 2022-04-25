import { Component, HostBinding } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: 'signing-done.component.html',
    animations: [accountModuleAnimation()],
})
export class SigningDoneComponent {

    @HostBinding('class.signing-done') class = true;
}
