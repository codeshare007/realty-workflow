import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styleUrls: ['create-or-edit-user-modal.component.less']
})
export class CreateOrEditUserModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    canChangeUserName = true;
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    user: UserEditDto = new UserEditDto();
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;

    userPasswordRepeat = '';
    userRole: string;
    userRoleName: string;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    show(userRole: string, userRoleName: string, userId?: number, publicId?: string): void {
        this.userRole = userRole;
        this.userRoleName = userRoleName;

        if (!userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }

        this._userService.getUserForEdit(userId, publicId, this.userRole).subscribe(userResult => {
            this.user = userResult.user;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;

            this.getProfilePicture(userId);

            if (userId) {
                this.active = true;

                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);

                this.sendActivationEmail = false;
            }

            this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
                this.modal.show();
            });
        });
    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(userId: number): void {
        if (!userId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            return;
        }

        this._profileService.getProfilePictureByUser(userId).subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            }
        });
    }

    onShown(): void {
        document.getElementById('Name').focus();
    }

    save(): void {
        let input = new CreateOrUpdateUserInput();

        input.user = this.user;
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames = [this.userRole];

        this.saving = true;
        this._userService.createOrUpdateUser(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.userPasswordRepeat = '';
        this.modal.hide();
    }
}
