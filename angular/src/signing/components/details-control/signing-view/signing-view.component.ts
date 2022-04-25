import { Component, HostBinding, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningFormDto, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: 'signing-view.component.html',
    animations: [accountModuleAnimation()],
})
export class SigningViewComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.signing-view') class = true;

    isActive = false;
    signing: SigningFormDto;
    code: string;

    constructor(
        injector: Injector,
        private _router: ActivatedRoute,
        private _signingServiceProxy: SigningServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._router.params
            .pipe(
                takeUntil(this.onDestroy$),
            ).subscribe((params) => {
                this.code = params['code'];
                this._getForSignin(this.code);
            });
    }

    private _getForSignin(id: string): void {
        this._signingServiceProxy.getForView(id, undefined)
            .subscribe((result: SigningFormDto) => {
                this.signing = result;
                this.isActive = true;
            });
    }
}
