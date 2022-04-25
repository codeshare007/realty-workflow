import { Component, HostBinding } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: 'signing-rejected.component.html',
    animations: [accountModuleAnimation()],
})
export class SigningRejectedComponent {

    @HostBinding('class.signing-rejected') class = true;
}
