import { Component, Injector, OnInit, Input } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';
import { ChangeUserLanguageDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
    selector: 'language-switch-dropdown',
    templateUrl: './language-switch-dropdown.component.html'
})
export class LanguageSwitchDropdownComponent extends ThemesLayoutBaseComponent implements OnInit {

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    @Input() isDropup = false;
    @Input() customStyle = 'btn btn-icon btn-dropdown btn-clean btn-lg mr-1';

    public constructor(
        injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.languages = _.filter(this.localization.languages, l => (l).isDisabled === false);
        this.currentLanguage = this.localization.currentLanguage;
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
                abp.appPath
            );

            window.location.reload();
        });
    }
}
