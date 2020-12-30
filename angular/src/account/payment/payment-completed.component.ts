import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'payment-completed',
  templateUrl: './payment-completed.component.html'
})
export class PaymentCompletedComponent extends AppComponentBase {
  constructor(
    _injector: Injector) {
    super(_injector);
  }
}
