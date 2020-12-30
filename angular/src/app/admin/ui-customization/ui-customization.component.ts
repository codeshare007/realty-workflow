import { Component, ViewEncapsulation, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ThemeSettingsDto, UiCustomizationSettingsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
    templateUrl: './ui-customization.component.html',
    styleUrls: ['./ui-customization.component.less'],
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class UiCustomizationComponent extends AppComponentBase implements OnInit {

    themeSettings: ThemeSettingsDto[];
    currentThemeName = '';

    constructor(
        injector: Injector,
        private _uiCustomizationService: UiCustomizationSettingsServiceProxy
    ) {
        super(injector);
    }

    getLocalizedThemeName(str: string): string {
        return this.l('Theme_' + abp.utils.toPascalCase(str));
    }

    ngOnInit(): void {
        this.currentThemeName = this.currentTheme.baseSettings.theme;
        this._uiCustomizationService.getUiManagementSettings().subscribe((settingsResult) => {
            this.themeSettings = _.sortBy(settingsResult, setting => {
                return setting.theme === 'default' ? 0 : parseInt(setting.theme.replace('theme', ''));
            });
        });
    }
}
