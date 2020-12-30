import { Component, EventEmitter, Injector, Output, ViewChild, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CurrentUserProfileEditDto,
    SettingScopes,
    ProfileServiceProxy,
    UpdateGoogleAuthenticatorKeyOutput,
    SendVerificationSmsInputDto
} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SmsVerificationModalComponent } from './sms-verification-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html'
})
export class MySettingsModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('mySettingsModal', { static: true }) modal: ModalDirective;
    @ViewChild('smsVerificationModal') smsVerificationModal: SmsVerificationModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public active = false;
    public saving = false;
    public isGoogleAuthenticatorEnabled = false;
    public isPhoneNumberConfirmed: boolean;
    public smsEnabled: boolean;
    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: SettingScopes = SettingScopes.User;
    private _initialTimezone: string = undefined;
    public savedPhoneNumber: string;
    public newPhoneNumber: string;
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    isTwoFactorLoginEnabledForApplication = false;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.isTwoFactorLoginEnabledForApplication =
            abp.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    }

    show(): void {
        this.active = true;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.smsEnabled = this.setting.getBoolean('App.UserManagement.SmsVerificationEnabled');
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.modal.show();
            this.isGoogleAuthenticatorEnabled = result.isGoogleAuthenticatorEnabled;
            this.isPhoneNumberConfirmed = result.isPhoneNumberConfirmed;
            this.savedPhoneNumber = result.phoneNumber;
        });
    }

    updateQrCodeSetupImageUrl(): void {
        this._profileService.updateGoogleAuthenticatorKey().subscribe((result: UpdateGoogleAuthenticatorKeyOutput) => {
            this.user.qrCodeSetupImageUrl = result.qrCodeSetupImageUrl;
            this.isGoogleAuthenticatorEnabled = true;
        });
    }

    disableGoogleAuthenticator(): void {
        this._profileService.disableGoogleAuthenticator().subscribe(() => {
            this.isGoogleAuthenticatorEnabled = false;
        });
    }

    smsVerify(): void {
        let input = new SendVerificationSmsInputDto();
        input.phoneNumber = this.user.phoneNumber;
        this._profileService.sendVerificationSms(input)
            .subscribe(() => {
                this.smsVerificationModal.show();
            });
    }

    changePhoneNumberToVerified(): void {
        this.isPhoneNumberConfirmed = true;
        this.savedPhoneNumber = this.user.phoneNumber;
    }

    onShown(): void {
        document.getElementById('Name').focus();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.appSession.user.name = this.user.name;
                this.appSession.user.surname = this.user.surname;
                this.appSession.user.userName = this.user.userName;
                this.appSession.user.emailAddress = this.user.emailAddress;
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                        window.location.reload();
                    });
                }
            });
    }

}
