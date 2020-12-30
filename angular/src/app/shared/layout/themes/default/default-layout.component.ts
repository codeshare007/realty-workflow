import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { StatusDnD } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';
import { ToggleOptions } from '@metronic/app/core/_base/layout/directives/toggle.directive';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Component({
    templateUrl: './default-layout.component.html',
    selector: 'default-layout',
    animations: [appModuleAnimation()]
})
export class DefaultLayoutComponent extends ThemesLayoutBaseComponent implements OnInit {

    menuCanvasOptions: OffcanvasOptions = {
        baseClass: 'aside',
        overlay: true,
        closeBy: 'kt_aside_close_btn',
        toggleBy: 'kt_aside_mobile_toggle'
    };

    userMenuToggleOptions: ToggleOptions = {
        target: this.document.body,
        targetState: 'topbar-mobile-on',
        toggleState: 'active'
    };

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    get statusDnD() {
        return StatusDnD;
    }

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document,
        private _dndService: DndService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    public onMouseEvent(event: MouseEvent, state: StatusDnD): void {
        event.preventDefault();

        switch (state) {
            case StatusDnD.Move:
                if (this._dndService.onDnd) {
                    this._dndService.moveDnd = true;
                    this._dndService.processMouseMove(event);
                } else {
                    this._dndService.moveDnd = false;
                    this._dndService.control = null;
                }
                break;
            case StatusDnD.Off:
                this._dndService.onDnd = false;
                break;
        }
    }
}
