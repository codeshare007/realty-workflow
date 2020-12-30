import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tenantChangeModal',
    templateUrl: './tenant-change-modal.component.html'
})
export class TenantChangeModalComponent extends AppComponentBase {

    @ViewChild('tenantChangeModal', {static: true}) modal: ModalDirective;
    @ViewChild('tenancyNameInput', {static: true}) tenancyNameInput: ElementRef;

    tenancyName = '';
    tenancyNameBuffer = '';
    submitButtonText = '';
    isSwitchToTenant = false;
    active = false;
    saving = false;

    constructor(
        private _accountService: AccountServiceProxy,
        injector: Injector
    ) {
        super(injector);
    }

    focusTenancyNameInput(): void {
        setTimeout(() => {
            document.getElementById('tenancyNameInput').focus();
        }, 100);
    }

    updateSubmitButtonText(): void {
        if (this.isSwitchToTenant) {
            this.submitButtonText = this.l('SwitchToTheTenant');
        } else {
            this.submitButtonText = this.l('SwitchToTheHost');
        }
    }

    show(tenancyName: string): void {
        this.tenancyName = tenancyName;
        this.isSwitchToTenant = tenancyName ? true : false;
        this.updateSubmitButtonText();
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        this.focusTenancyNameInput();
    }

    switchToTenant(e): void {
        if (e.target.checked) {
            this.tenancyName = this.tenancyNameBuffer;
            this.focusTenancyNameInput();
        } else {
            this.tenancyNameBuffer = this.tenancyName;
            this.tenancyName = '';
        }

        this.updateSubmitButtonText();
    }

    save(): void {

        if (!this.tenancyName) {
            abp.multiTenancy.setTenantIdCookie(undefined);
            this.close();
            location.reload();
            return;
        }

        let input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this.saving = true;
        this._accountService.isTenantAvailable(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: IsTenantAvailableOutput) => {
                switch (result.state) {
                    case TenantAvailabilityState.Available:
                        abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        this.close();
                        location.reload();
                        return;
                    case TenantAvailabilityState.InActive:
                        this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
                        this.focusTenancyNameInput();
                        break;
                    case TenantAvailabilityState.NotFound: //NotFound
                        this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
                        this.focusTenancyNameInput();
                        break;
                }
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
