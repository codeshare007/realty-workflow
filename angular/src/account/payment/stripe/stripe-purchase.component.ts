import { Component, Input, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';
import { TenantRegistrationHelperService } from '@account/register/tenant-registration-helper.service';

import {
    StripePaymentServiceProxy,
    PaymentServiceProxy,
    SubscriptionPaymentDto,
    StripeConfigurationDto,
    SubscriptionPaymentGatewayType,
    SubscriptionStartType,
    EditionPaymentType,
    StripeCreatePaymentSessionInput
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'stripe-purchase-component',
    templateUrl: './stripe-purchase.component.html',
    animations: [accountModuleAnimation()]
})

export class StripePurchaseComponent extends AppComponentBase implements OnInit {
    @Input() editionPaymentType: EditionPaymentType;

    amount = 0;
    description = '';

    subscriptionPayment: SubscriptionPaymentDto;
    stripeIsLoading = true;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
    subscriptionStartType = SubscriptionStartType;

    paymentId;
    successCallbackUrl;
    errorCallbackUrl;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _stripePaymentAppService: StripePaymentServiceProxy,
        private _paymentAppService: PaymentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.spinnerService.show();

        this.stripeIsLoading = true;
        this.paymentId = this._activatedRoute.snapshot.queryParams['paymentId'];

        new ScriptLoaderService().load('https://js.stripe.com/v3').then(() => {
            this._stripePaymentAppService.getConfiguration()
                .subscribe(
                    (config: StripeConfigurationDto) => {
                        this._stripePaymentAppService.createPaymentSession(new StripeCreatePaymentSessionInput({
                            paymentId: this.paymentId,
                            successUrl: AppConsts.appBaseUrl + '/account/stripe-payment-result',
                            cancelUrl: AppConsts.appBaseUrl + '/account/stripe-cancel-payment'
                        })).subscribe(
                            sessionId => {
                                this._paymentAppService.getPayment(this.paymentId)
                                    .subscribe(
                                        (result: SubscriptionPaymentDto) => {
                                            this.spinnerService.hide();
                                            this.amount = result.amount;
                                            this.description = result.description;
                                            this.successCallbackUrl = result.successUrl;
                                            this.errorCallbackUrl = result.errorUrl;
                                            let stripe = (<any>window).Stripe(config.publishableKey);
                                            let checkoutButton = document.getElementById('stripe-checkout');
                                            checkoutButton.addEventListener('click', function () {
                                                stripe.redirectToCheckout({ sessionId: sessionId });
                                            });

                                            this.stripeIsLoading = false;
                                        },
                                        (err) => {
                                            this.spinnerService.hide();
                                        });
                            },
                            (err) => {
                                this.spinnerService.hide();
                            }
                        );
                    },
                    (err) => {
                        this.spinnerService.hide();
                    });
        }).catch(err => {
            this.spinnerService.hide();
        });
    }
}
