import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl: './default-brand.component.html',
    selector: 'default-brand',
    encapsulation: ViewEncapsulation.None
})
export class DefaultBrandComponent extends AppComponentBase {

    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-' + this.currentTheme.baseSettings.menu.asideSkin + '.jpg';
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    toggleLeftAside(): void {
        this.document.body.classList.toggle('aside-minimize');
        this.triggerAsideToggleClickEvent();
    }

    triggerAsideToggleClickEvent(): void {
        abp.event.trigger('app.kt_aside_toggler.onClick');
    }
}
