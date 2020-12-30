import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { AccountComponent } from './account.component';
import { AccountRouteGuard } from './auth/account-route-guard';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { LoginComponent } from './login/login.component';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { BuyEditionComponent } from './payment/buy.component';
import { UpgradeEditionComponent } from './payment/upgrade.component';
import { ExtendEditionComponent } from './payment/extend.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterComponent } from './register/register.component';
import { SelectEditionComponent } from './register/select-edition.component';
import { PayPalPurchaseComponent } from './payment/paypal/paypal-purchase.component';
import { StripePurchaseComponent } from './payment/stripe/stripe-purchase.component';
import { StripeCancelPaymentComponent } from './payment/stripe/stripe-cancel-payment.component';
import { StripePaymentResultComponent } from './payment/stripe/stripe-payment-result.component';
import { PaymentCompletedComponent } from './payment/payment-completed.component';
import { SessionLockScreenComponent } from './login/session-lock-screen.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: '', redirectTo: 'login' },
                    { path: 'login', component: LoginComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register', component: RegisterComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register-tenant', component: RegisterTenantComponent, canActivate: [AccountRouteGuard] },
                    { path: 'register-tenant-result', component: RegisterTenantResultComponent, canActivate: [AccountRouteGuard] },
                    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AccountRouteGuard] },
                    { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AccountRouteGuard] },
                    { path: 'email-activation', component: EmailActivationComponent, canActivate: [AccountRouteGuard] },
                    { path: 'confirm-email', component: ConfirmEmailComponent, canActivate: [AccountRouteGuard] },
                    { path: 'send-code', component: SendTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },

                    { path: 'buy', component: BuyEditionComponent },
                    { path: 'extend', component: ExtendEditionComponent },
                    { path: 'upgrade', component: UpgradeEditionComponent },
                    { path: 'select-edition', component: SelectEditionComponent },
                    { path: 'paypal-purchase', component: PayPalPurchaseComponent },
                    { path: 'stripe-purchase', component: StripePurchaseComponent },
                    { path: 'stripe-payment-result', component: StripePaymentResultComponent },
                    { path: 'stripe-cancel-payment', component: StripeCancelPaymentComponent },
                    { path: 'payment-completed', component: PaymentCompletedComponent },
                    { path: 'session-locked', component: SessionLockScreenComponent },

                    { path: '**', redirectTo: 'login' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule {
    constructor(
        private router: Router,
        private _uiCustomizationService: AppUiCustomizationService
    ) {
        router.events.subscribe((event: NavigationEnd) => {
            setTimeout(() => {
                this.toggleBodyCssClass(event.url);
            }, 0);
        });
    }

    toggleBodyCssClass(url: string): void {
        if (!url) {
            this.setAccountModuleBodyClassInternal();
            return;
        }

        if (url.indexOf('/account/') >= 0) {
            this.setAccountModuleBodyClassInternal();
        } else {
            document.body.className = this._uiCustomizationService.getAppModuleBodyClass();
        }
    }

    setAccountModuleBodyClassInternal(): void {
        let currentBodyClass = document.body.className;

        let classesToRemember = '';

        if (currentBodyClass.indexOf('swal2-toast-shown') >= 0) {
            classesToRemember += ' swal2-toast-shown';
        }

        document.body.className = this._uiCustomizationService.getAccountModuleBodyClass() + ' ' + classesToRemember;
    }
}
