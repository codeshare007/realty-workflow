import { Component, Injector, Input } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';

@Component({
    selector: 'quick-theme-selection',
    templateUrl: './quick-theme-selection.component.html'
})
export class QuickThemeSelectionComponent extends ThemesLayoutBaseComponent {

    isQuickThemeSelectEnabled: boolean = this.setting.getBoolean('App.UserManagement.IsQuickThemeSelectEnabled');

    @Input() customStyle = 'btn btn-icon btn-clean btn-lg mr-1';

    public constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
