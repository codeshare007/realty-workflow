import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ActivateEmailInput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';

@Component({
    template: `<div class="login-form"><div class="alert alert-success text-center" role="alert"><div class="alert-text">{{waitMessage}}</div></div></div>`
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {

    waitMessage: string;

    model: ActivateEmailInput = new ActivateEmailInput();

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');

        this.model.c = this._activatedRoute.snapshot.queryParams['c'];

        this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
            let reloadNeeded = this.appSession.changeTenantIfNeeded(
                tenantId
            );

            if (reloadNeeded) {
                return;
            }

            this._accountService.activateEmail(this.model)
                .subscribe(() => {
                    this.notify.success(this.l('YourEmailIsConfirmedMessage'), '',
                        {
                            onClose: () => {
                                this._router.navigate(['account/login']);
                            }
                        });
                });
        });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, 10);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
