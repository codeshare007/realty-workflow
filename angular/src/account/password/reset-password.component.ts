import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, ResetPasswordOutput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { ResetPasswordModel } from './reset-password.model';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { ReCaptchaV3Service } from 'ngx-captcha';

@Component({
    templateUrl: './reset-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;

    model: ResetPasswordModel = new ResetPasswordModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _reCaptchaV3Service: ReCaptchaV3Service,
        private _appUrlService: AppUrlService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });

        if (this._activatedRoute.snapshot.queryParams['c']) {
            this.model.c = this._activatedRoute.snapshot.queryParams['c'];

            this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
                this.appSession.changeTenantIfNeeded(
                    tenantId
                );
            });
        } else {
            this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
            this.model.resetCode = this._activatedRoute.snapshot.queryParams['resetCode'];

            this.appSession.changeTenantIfNeeded(
                this.parseTenantId(
                    this._activatedRoute.snapshot.queryParams['tenantId']
                )
            );
        }
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }

    save(): void {
        this.saving = true;
        this._accountService.resetPassword(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                    this._router.navigate(['account/login']);
                    return;
                }

                let recaptchaCallback = (token: string) => {
                    // Autheticate
                    this.saving = true;
                    this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                    this._loginService.authenticateModel.password = this.model.password;
                    this._loginService.authenticate(() => {
                        this.saving = false;
                    }, null, token);
                };

                if (this.useCaptcha) {
                    this._reCaptchaV3Service.execute(this.recaptchaSiteKey, 'login', (token) => {
                        recaptchaCallback(token);
                    });
                } else {
                    recaptchaCallback(null);
                }
            });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
