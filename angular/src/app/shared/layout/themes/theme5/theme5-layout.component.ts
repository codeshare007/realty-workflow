import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { DOCUMENT } from '@angular/common';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';

@Component({
    templateUrl: './theme5-layout.component.html',
    selector: 'theme5-layout',
    animations: [appModuleAnimation()]
})
export class Theme5LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    asideToggler;

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

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    ngAfterViewInit(): void {
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
        this.asideToggler = new KTOffcanvas(this.document.getElementById('kt_aside'), {
            overlay: true,
            baseClass: 'aside',
            toggleBy: ['kt_aside_toggle', 'kt_aside_tablet_and_mobile_toggle']
        });
    }
}
