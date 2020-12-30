import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';

@Component({
    templateUrl: './theme4-layout.component.html',
    selector: 'theme4-layout',
    animations: [appModuleAnimation()]
})
export class Theme4LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    asideToggleOptions: ToggleOptions = {
        target: 'kt_aside',
        targetState: 'aside-on',
        toggleState: 'active'
    };

    userMenuToggleOptions: ToggleOptions = {
        target: 'kt_header',
        targetState: 'topbar-mobile-on',
        toggleState: 'active'
    };

    constructor(
        injector: Injector,
        private layoutRefService: LayoutRefService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    ngAfterViewInit(): void {
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
    }
}
