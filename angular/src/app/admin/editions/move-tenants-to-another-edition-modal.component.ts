import { Component, ViewChild, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MoveTenantsToAnotherEditionDto, ComboboxItemDto, CommonLookupServiceProxy, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppConsts } from '@shared/AppConsts';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'moveTenantsToAnotherEditionModal',
    templateUrl: './move-tenants-to-another-edition-modal.component.html'
})
export class MoveTenantsToAnotherEditionModalComponent extends AppComponentBase {

    @ViewChild('editModal', {static: true}) modal: ModalDirective;

    active = false;
    saving = false;
    appBaseUrl = '';
    tenantCount = 0;

    moveTenantsInput: MoveTenantsToAnotherEditionDto = new MoveTenantsToAnotherEditionDto();
    targetEditions: ComboboxItemDto[] = [];

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    show(editionId: number): void {
        this.active = true;

        this.moveTenantsInput.sourceEditionId = editionId;

        this._commonLookupService.getEditionsForCombobox(undefined).subscribe(editionsResult => {
            this.targetEditions = editionsResult.items;
            this.modal.show();
        });

        this._editionService.getTenantCount(editionId)
            .subscribe(editionCountResult => {
                this.tenantCount = editionCountResult;
                this.appBaseUrl = AppConsts.appBaseUrl;
            });
    }

    save(): void {

        this.saving = true;
        this._editionService.moveTenantsToAnotherEdition(this.moveTenantsInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('MoveTenantsToAnotherEditionStartedNotification'));
                this.close();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
