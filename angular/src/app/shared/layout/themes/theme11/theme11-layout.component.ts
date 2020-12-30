import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Component({
    templateUrl: './theme11-layout.component.html',
    selector: 'theme11-layout',
    animations: [appModuleAnimation()]
})
export class Theme11LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    userMenuCanvas;
    asideMenuCanvas;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        this.defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-light.jpg';

        this.userMenuCanvas = new KTOffcanvas(this.document.getElementById('kt_header_topbar'), {
            overlay: true,
            baseClass: 'topbar',
            toggleBy: 'kt_header_mobile_topbar_toggle'
        });

        this.asideMenuCanvas = new KTOffcanvas(this.document.getElementById('kt_header_bottom'), {
            overlay: true,
            baseClass: 'header-bottom',
            toggleBy: 'kt_header_mobile_toggle'
        });
    }
}
