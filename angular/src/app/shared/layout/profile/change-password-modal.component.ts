import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ChangePasswordInput, PasswordComplexitySetting, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'changePasswordModal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.less']
})
export class ChangePasswordModalComponent extends AppComponentBase {

    @ViewChild('currentPasswordInput', {static: true}) currentPasswordInput: ElementRef;
    @ViewChild('changePasswordModal', {static: true}) modal: ModalDirective;

    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    currentPassword: string;
    password: string;
    confirmPassword: string;

    saving = false;
    active = false;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.currentPassword = '';
        this.password = '';
        this.confirmPassword = '';

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
            this.modal.show();
        });
    }

    onShown(): void {
        document.getElementById('CurrentPassword').focus();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        let input = new ChangePasswordInput();
        input.currentPassword = this.currentPassword;
        input.newPassword = this.password;

        this.saving = true;
        this._profileService.changePassword(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('YourPasswordHasChangedSuccessfully'));
                this.close();
            });
    }
}
