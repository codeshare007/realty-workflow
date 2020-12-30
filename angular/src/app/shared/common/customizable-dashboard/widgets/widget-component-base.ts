import { AppComponentBase } from '@shared/common/app-component-base';
import { OnDestroy, Injector, Component } from '@angular/core';
import { timer, Subscription } from 'rxjs';

@Component({ template: '' })
export abstract class WidgetComponentBaseComponent extends AppComponentBase implements OnDestroy {
    delay = 300;
    timer: Subscription;

    constructor(injector: Injector) {
        super(injector);
    }

    /**
     * Run methods delayed. If runDelay called multiple time before its delay, only run last called.
     * @param method Method to call
     */
    runDelayed(method: () => void) {
        if (this.timer && !this.timer.closed) {
            this.timer.unsubscribe();
        }

        this.timer = timer(this.delay).subscribe(() => {
            method();
        });
    }

    ngOnDestroy(): void {
        if (this.timer && !this.timer.closed) {
            this.timer.unsubscribe();
        }
    }
}
