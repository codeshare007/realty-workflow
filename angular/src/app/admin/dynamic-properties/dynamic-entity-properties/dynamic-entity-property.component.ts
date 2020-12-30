import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DynamicEntityPropertyServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateDynamicEntityPropertyModalComponent } from './create-dynamic-entity-property-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute, Params } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';

@Component({
    templateUrl: './dynamic-entity-property.component.html',
    animations: [appModuleAnimation()]
})
export class DynamicEntityPropertyComponent extends AppComponentBase implements OnInit {
    @ViewChild('createDynamicEntityPropertyModal') createDynamicEntityPropertyModal: CreateDynamicEntityPropertyModalComponent;
    entityFullName: string;

    breadcrumbs: BreadcrumbItem[] = [
        new BreadcrumbItem(this.l('DynamicPropertyManagement'), '/app/admin/dynamic-property'),
        new BreadcrumbItem(this.l('DynamicEntityProperties')),
    ];

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _dynamicEntityPropertyService: DynamicEntityPropertyServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this._activatedRoute.params
            .subscribe(
                (params: Params) => {
                    this.entityFullName = params['entityFullName'];
                    this.getDynamicEntityProperties();
                });
    }

    getDynamicEntityProperties(): void {
        this.showMainSpinner();
        this._dynamicEntityPropertyService.getAllPropertiesOfAnEntity(this.entityFullName).subscribe(
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

    addNewDynamicEntityProperty(): void {
        this.createDynamicEntityPropertyModal.show(this.entityFullName);
    }

    deleteDynamicEntityProperty(id: number): void {
        this.message.confirm(
            this.l('DeleteDynamicPropertyMessage'),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._dynamicEntityPropertyService.delete(id).subscribe(() => {
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                        this.getDynamicEntityProperties();
                    });
                }
            }
        );
    }
}
