import { Component, Injector, ViewEncapsulation, ElementRef, HostBinding, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UiCustomizationSettingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';

@Component({
    templateUrl: './theme-selection-panel.component.html',
    selector: 'theme-selection-panel',
    styleUrls: ['./theme-selection-panel.less'],
    encapsulation: ViewEncapsulation.None
})
export class ThemeSelectionPanelComponent extends AppComponentBase implements OnInit {

    currentThemeName = '';

    offcanvasOptions: OffcanvasOptions = {
        overlay: true,
        baseClass: 'offcanvas',
        placement: 'right',
        closeBy: 'kt_demo_panel_close',
        toggleBy: 'kt_theme_selection_panel_toggle'
    };

    constructor(
        injector: Injector,
        private _uiCustomizationService: UiCustomizationSettingsServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.currentThemeName = this.currentTheme.baseSettings.theme;
    }

    getLocalizedThemeName(str: string): string {
        return this.l('Theme_' + abp.utils.toPascalCase(str));
    }

    changeTheme(themeName: string) {
        this._uiCustomizationService.changeThemeWithDefaultValues(themeName).subscribe(() => {
            window.location.reload();
        });
    }
}
