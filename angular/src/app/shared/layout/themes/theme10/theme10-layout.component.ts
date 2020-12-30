import { Injector, ElementRef, Component, ViewChild, OnInit, AfterViewInit, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';

@Component({
    templateUrl: './theme10-layout.component.html',
    selector: 'theme10-layout',
    animations: [appModuleAnimation()]
})
export class Theme10LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

    userMenuToggleOptions: ToggleOptions = {
        target: 'kt_aside',
        targetState: 'aside-on',
        toggleState: 'active'
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

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
