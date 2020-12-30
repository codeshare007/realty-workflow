import { Injector, ElementRef, Component, OnInit, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './theme6-layout.component.html',
    selector: 'theme6-layout',
    animations: [appModuleAnimation()]
})
export class Theme6LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    userMenuToggleOptions: ToggleOptions = {
        target: 'kt_aside',
        targetState: 'aside-on',
        toggleState: 'active'
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }
}
