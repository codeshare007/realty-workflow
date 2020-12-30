import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { DOCUMENT } from '@angular/common';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';

@Component({
    templateUrl: './theme2-layout.component.html',
    selector: 'theme2-layout',
    animations: [appModuleAnimation()]
})
export class Theme2LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;

    menuCanvasOptions: OffcanvasOptions = {
        baseClass: 'aside',
        overlay: true,
        closeBy: 'kt_aside_close_btn',
        toggleBy: 'kt_header_mobile_toggle'
    };

    userMenuToggleOptions: ToggleOptions = {
        target: this.document.body,
        targetState: 'topbar-mobile-on',
        toggleState: 'active'
    };

    constructor(
        injector: Injector,
        private layoutRefService: LayoutRefService,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    ngAfterViewInit(): void {
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
    }

    toggleLeftAside(): void {
        this.document.body.classList.toggle('header-menu-wrapper-on');
        this.document.getElementById('kt_header_menu_wrapper').classList.toggle('header-menu-wrapper-on');
    }
}
