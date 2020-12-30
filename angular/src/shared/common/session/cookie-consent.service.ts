import { Injectable } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';

@Injectable()
export class CookieConsentService {

    constructor(private _appLocalizationService: AppLocalizationService) {

    }

    public init() {
        if (abp.setting.getBoolean('App.UserManagement.IsCookieConsentEnabled')) {
            (window as any).cookieconsent.initialise({
                'showLink': false,
                'content': {
                    'message': this._appLocalizationService.l('CookieConsent_Message'),
                    'dismiss': this._appLocalizationService.l('CookieConsent_Dismiss')
                }
            });
        }
    }
}
