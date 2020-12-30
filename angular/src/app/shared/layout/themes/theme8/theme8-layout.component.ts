import { Injector, ElementRef, Component, ViewChild, OnInit, AfterViewInit, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './theme8-layout.component.html',
    selector: 'theme8-layout',
    animations: [appModuleAnimation()]
})
export class Theme8LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
    userMenuToggleOptions: ToggleOptions = {
        target: this.document.body,
        targetState: 'topbar-mobile-on',
        toggleState: 'active'
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

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
    }
}
