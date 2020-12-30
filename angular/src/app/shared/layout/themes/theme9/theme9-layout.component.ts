import { Injector, ElementRef, Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './theme9-layout.component.html',
    selector: 'theme9-layout',
    animations: [appModuleAnimation()]
})
export class Theme9LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('kt_aside', { static: true }) kt_aside: ElementRef;
    @ViewChild('ktHeader', { static: false }) ktHeader: ElementRef;

    userMenuToggleOptions: ToggleOptions = {
        target: this.document.body,
        targetState: 'topbar-mobile-on',
        toggleState: 'active'
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-dark-2.svg';

    constructor(
        injector: Injector,
        private layoutRefService: LayoutRefService,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    triggerAsideToggleClickEvent(): void {
        abp.event.trigger('app.kt_aside_toggler.onClick');
    }

    ngAfterViewInit(): void {
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
    }
}
