import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDto, TenantServiceProxy, UpdateTenantFeaturesInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'tenantFeaturesModal',
    templateUrl: './tenant-features-modal.component.html'
})
export class TenantFeaturesModalComponent extends AppComponentBase {

    @ViewChild('tenantFeaturesModal', {static: true}) modal: ModalDirective;
    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    active = false;
    saving = false;

    resettingFeatures = false;
    tenantId: number;
    tenantName: string;
    featureEditData: any = null;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy
    ) {
        super(injector);
    }

    show(tenantId: number, tenantName: string): void {
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.active = true;
        this.loadFeatures();
        this.modal.show();
    }

    loadFeatures(): void {
        const self = this;
        self._tenantService.getTenantFeaturesForEdit(this.tenantId).subscribe((result) => {
            self.featureTree.editData = result;
        });
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }


        const input = new UpdateTenantFeaturesInput();
        input.id = this.tenantId;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._tenantService.updateTenantFeatures(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
            });
    }

    resetFeatures(): void {
        const input = new EntityDto();
        input.id = this.tenantId;

        this.resettingFeatures = true;
        this._tenantService.resetTenantSpecificFeatures(input)
            .pipe(finalize(() => this.resettingFeatures = false))
            .subscribe(() => {
                this.notify.info(this.l('ResetSuccessfully'));
                this.loadFeatures();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
