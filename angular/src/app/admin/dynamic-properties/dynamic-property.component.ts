import {Component, Injector, ViewChild} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {DynamicPropertyDto, DynamicPropertyServiceProxy} from '@shared/service-proxies/service-proxies';
import {Router} from '@angular/router';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {CreateOrEditDynamicPropertyModalComponent} from './create-or-edit-dynamic-property-modal.component';
import {InputTypeConfigurationService} from '@app/shared/common/input-types/input-type-configuration.service';
import {DynamicPropertyValueModalComponent} from '@app/admin/dynamic-properties/dynamic-property-value/dynamic-property-value-modal.component';

@Component({
    templateUrl: './dynamic-property.component.html',
    animations: [appModuleAnimation()]
})
export class DynamicPropertyComponent extends AppComponentBase {
    @ViewChild('createOrEditDynamicProperty', {static: true}) createOrEditDynamicPropertyModal: CreateOrEditDynamicPropertyModalComponent;
    @ViewChild('dynamicPropertyValueModal', {static: true}) dynamicPropertyValueModal: DynamicPropertyValueModalComponent;

    constructor(
        injector: Injector,
        private _dynamicPropertyService: DynamicPropertyServiceProxy,
        private _router: Router,
        private _inputTypeConfigurationService: InputTypeConfigurationService
    ) {
        super(injector);
    }

    getDynamicProperties(): void {
        this.showMainSpinner();
        this._dynamicPropertyService.getAll().subscribe(
            (result) => {
                this.primengTableHelper.totalRecordsCount = result.items.length;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
                this.hideMainSpinner();
            },
            (err) => {
                this.hideMainSpinner();
            }
        );
    }

    addNewDynamicProperty(): void {
        this.createOrEditDynamicPropertyModal.show();
    }

    editDynamicProperty(dynamicPropertyId: number): void {
        this.createOrEditDynamicPropertyModal.show(dynamicPropertyId);
    }

    deleteDynamicProperty(dynamicPropertyId: number): void {
        this.message.confirm(
            this.l('DeleteDynamicPropertyMessage'),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._dynamicPropertyService.delete(dynamicPropertyId).subscribe(() => {
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                        this.getDynamicProperties();
                    });
                }
            }
        );
    }

    editValues(dynamicProperty: DynamicPropertyDto): void {
        this.dynamicPropertyValueModal.show(dynamicProperty.id);
    }

    hasValues(inputType: string): boolean {
        return this._inputTypeConfigurationService.getByName(inputType).hasValues;
    }
}
