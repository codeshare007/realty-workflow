import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'stripe-cancel-payment',
  templateUrl: './stripe-cancel-payment.component.html'
})
export class StripeCancelPaymentComponent extends AppComponentBase {
  constructor(
    _injector: Injector) {
    super(_injector);
  }
}
