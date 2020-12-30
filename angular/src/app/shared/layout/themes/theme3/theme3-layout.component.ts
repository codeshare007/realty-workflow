import { Injector, ElementRef, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { DOCUMENT } from '@angular/common';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';

@Component({
    templateUrl: './theme3-layout.component.html',
    selector: 'theme3-layout',
    animations: [appModuleAnimation()]
})
export class Theme3LayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    asideToggler;

    menuCanvasOptions: OffcanvasOptions = {
        baseClass: 'aside',
        overlay: true,
        closeBy: 'kt_aside_close_btn',
        toggleBy: 'kt_aside_mobile_toggle'
    };

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        this.defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-light-sm.svg';
        this.asideToggler = new KTToggle(document.getElementById('kt_aside_toggle'), {
            target: this.document.body,
            targetState: 'aside-minimize',
            toggleState: 'active'
        });
    }
}
