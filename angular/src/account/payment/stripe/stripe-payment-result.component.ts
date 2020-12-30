import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { StripePaymentServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'stripe-payment-result',
  templateUrl: './stripe-payment-result.component.html'
})
export class StripePaymentResultComponent extends AppComponentBase implements OnInit {

  constructor(
    _injector: Injector,
    private _stripePaymentService: StripePaymentServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sessionService: AbpSessionService) {
    super(_injector);
  }
  sessionId: string;
  paymentId: number;

  controlTimeout = 1000 * 5;
  maxControlCount = 5;

  ngOnInit() {
    this.sessionId = this._activatedRoute.snapshot.queryParams['sessionId'];
    this._stripePaymentService.getPayment(this.sessionId)
      .subscribe(payment => {
        if (this._sessionService.tenantId !== payment.tenantId) {
          this._router.navigate(['']);
        }

        this.paymentId = payment.id;
        this.getPaymentResult();
      });
  }

  getPaymentResult(): void {
    this._stripePaymentService.getPaymentResult(this.paymentId).subscribe(
      paymentResult => {
        if (paymentResult.paymentDone) {
          this._router.navigate(['account/payment-completed']);
        } else {
          this.controlAgain();
        }
      },
      err => {
        this.controlAgain();
      }
    );
  }

  controlAgain() {
    if (this.maxControlCount === 0) {
      return;
    }

    setTimeout(() => {
            this.getPaymentResult();
        }, this.controlTimeout);
    this.controlTimeout *= 2;
    this.maxControlCount--;
  }
}
