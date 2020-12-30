import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    EditionSelectDto,
    PaymentInfoDto,
    PaymentServiceProxy,
    CreatePaymentDto,
    PaymentGatewayModel,
    EditionPaymentType,
    PaymentPeriodType,
    SubscriptionPaymentGatewayType,
    SubscriptionPaymentType,
    SubscriptionStartType,
    TenantRegistrationServiceProxy
} from '@shared/service-proxies/service-proxies';

import { AppConsts } from '@shared/AppConsts';
import { PaymentHelperService } from './payment-helper.service';
import { EditionHelperService } from './edition-helper.service';

@Component({
    templateUrl: './upgrade.component.html',
    animations: [accountModuleAnimation()]
})

export class UpgradeEditionComponent extends AppComponentBase implements OnInit {

    subscriptionPaymentType: typeof SubscriptionPaymentType = SubscriptionPaymentType;
    subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;

    editionPaymentType: EditionPaymentType;
    edition: EditionSelectDto = new EditionSelectDto();
    tenantId: number = abp.session.tenantId;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;

    paymentPeriodType: PaymentPeriodType;
    additionalPrice: number;
    upgradeEditionId;
    editionPaymentTypeCheck: typeof EditionPaymentType = EditionPaymentType;
    paymentGateways: PaymentGatewayModel[];

    showPaymentForm = false;
    constructor(
        injector: Injector,
        private _router: Router,
        private _paymentHelperService: PaymentHelperService,
        private _activatedRoute: ActivatedRoute,
        private _paymentAppService: PaymentServiceProxy,
        private _tenantRegistrationAppService: TenantRegistrationServiceProxy,
        private _editionHelperService: EditionHelperService) {
        super(injector);
    }

    ngOnInit(): void {
        this.showMainSpinner();
        this.editionPaymentType = parseInt(this._activatedRoute.snapshot.queryParams['editionPaymentType']);
        this.upgradeEditionId = this._activatedRoute.snapshot.queryParams['upgradeEditionId'];

        if (this.appSession.tenant.edition.isFree) {
            this._tenantRegistrationAppService.getEdition(this.upgradeEditionId)
                .subscribe((upgradeEdition) => {
                    if (this._editionHelperService.isEditionFree(upgradeEdition)) {
                        this._paymentAppService.switchBetweenFreeEditions(upgradeEdition.id)
                            .subscribe(() => {
                                this.hideMainSpinner();
                                this._router.navigate(['app/admin/subscription-management']);
                            });
                    } else {
                        this.hideMainSpinner();
                        this.redirectToBuy();
                    }
                });
            return;
        }
        //edition is not free but there is no previous payment(tenant might be created with paid edition.)
        this._paymentAppService.hasAnyPayment()
            .subscribe(hasPayment => {
                if (!hasPayment) {
                    this.hideMainSpinner();
                    this.redirectToBuy();
                    return;
                }

                this._paymentAppService.getPaymentInfo(this.upgradeEditionId)
                    .subscribe((result: PaymentInfoDto) => {
                        this.edition = result.edition;
                        this.additionalPrice = Number(result.additionalPrice.toFixed(2));

                        if (this.additionalPrice < AppConsts.MinimumUpgradePaymentAmount) {
                            this._paymentAppService.upgradeSubscriptionCostsLessThenMinAmount(this.upgradeEditionId).subscribe(() => {
                                this.spinnerService.hide();
                                this.showPaymentForm = true;
                                this._router.navigate(['app/admin/subscription-management']);
                            });
                        } else {
                            this.spinnerService.hide();
                            this.showPaymentForm = true;
                        }

                    });

                this._paymentAppService.getLastCompletedPayment().subscribe(result => {
                    let gateway = new PaymentGatewayModel();
                    gateway.gatewayType = (result.gateway as any);
                    gateway.supportsRecurringPayments = true;

                    this.paymentGateways = [gateway];
                    this.paymentPeriodType = result.paymentPeriodType;

                    if (this.appSession.tenant.subscriptionPaymentType === this.subscriptionPaymentType.Manual) {
                        this._paymentAppService.getActiveGateways(undefined)
                            .subscribe((result: PaymentGatewayModel[]) => {
                                this.paymentGateways = result;
                            });
                    }
                });
            });
    }

    checkout(gatewayType) {
        let input = new CreatePaymentDto();
        input.editionId = this.edition.id;
        input.editionPaymentType = ((this.editionPaymentType) as any);
        input.paymentPeriodType = ((this.paymentPeriodType) as any);
        input.recurringPaymentEnabled = this.hasRecurringSubscription();
        input.subscriptionPaymentGatewayType = gatewayType;
        input.successUrl = AppConsts.remoteServiceBaseUrl + '/api/services/app/payment/' + this._paymentHelperService.getEditionPaymentType(this.editionPaymentType) + 'Succeed';
        input.errorUrl = AppConsts.remoteServiceBaseUrl + '/api/services/app/payment/PaymentFailed';

        this._paymentAppService.createPayment(input)
            .subscribe((paymentId: number) => {
                this._router.navigate(['account/' + this.getPaymentGatewayType(gatewayType).toLocaleLowerCase() + '-purchase'],
                    {
                        queryParams: {
                            paymentId: paymentId,
                            isUpgrade: true,
                            redirectUrl: 'app/admin/subscription-management'
                        }
                    });
            });
    }

    getPaymentGatewayType(gatewayType): string {
        return this._paymentHelperService.getPaymentGatewayType(gatewayType);
    }

    hasRecurringSubscription(): boolean {
        return this.appSession.tenant.subscriptionPaymentType !== this.subscriptionPaymentType.Manual;
    }

    redirectToBuy(): void {
        this._router.navigate(['account/buy'],
            {
                queryParams: {
                    tenantId: this.appSession.tenant.id,
                    editionPaymentType: EditionPaymentType.BuyNow,
                    editionId: this.upgradeEditionId,
                    subscriptionStartType: this.subscriptionStartType.Paid
                }
            });
    }
}
