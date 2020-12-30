import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LoginService } from './login.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-session-lock-screen',
  templateUrl: './session-lock-screen.component.html',
  styleUrls: ['session-lock-screen.component.less'],
  animations: [accountModuleAnimation()]
})
export class SessionLockScreenComponent extends AppComponentBase {
  recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;

  userInfo: any;
  submitting = false;

  constructor(
    injector: Injector,
    private _profileService: ProfileServiceProxy,
    private _reCaptchaV3Service: ReCaptchaV3Service,
    public loginService: LoginService) {
    super(injector);
    this.getLastUserInfo();
  }

  getLastUserInfo(): void {
    let cookie = abp.utils.getCookieValue('userInfo');
    if (!cookie) {
      location.href = '';
    }

    let userInfo = JSON.parse(cookie);
    if (!userInfo) {
      location.href = '';
    }
    this.loginService.authenticateModel.userNameOrEmailAddress = userInfo.userName;
    this.userInfo = {
      userName: userInfo.userName,
      tenant: userInfo.tenant,
      profilePicture: ''
    };

    this._profileService.getProfilePictureByUserName(userInfo.userName)
        .subscribe(
          (data) => {
            if (data.profilePicture) {
              this.userInfo.profilePicture = 'data:image/jpeg;base64,' + data.profilePicture;
            } else {
              this.userInfo.profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
            }
          },
          () => {
            this.userInfo.profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
          });
  }

  login(): void {
    let recaptchaCallback = (token: string) => {
      this.showMainSpinner();

      this.submitting = true;
      this.loginService.authenticate(
        () => {
          this.submitting = false;
          this.hideMainSpinner();
        },
        null,
        token
      );

    };

    if (this.useCaptcha) {
      this._reCaptchaV3Service.execute(this.recaptchaSiteKey, 'login', (token) => {
        recaptchaCallback(token);
      });
    } else {
      recaptchaCallback(null);
    }
  }

  get useCaptcha(): boolean {
    return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
  }
}
