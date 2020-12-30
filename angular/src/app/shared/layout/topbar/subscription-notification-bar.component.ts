import { Component, Injector } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';

@Component({
    selector: 'subscription-notification-bar',
    templateUrl: './subscription-notification-bar.component.html'
})
export class SubscriptionNotificationBarComponent extends ThemesLayoutBaseComponent {

    public constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
