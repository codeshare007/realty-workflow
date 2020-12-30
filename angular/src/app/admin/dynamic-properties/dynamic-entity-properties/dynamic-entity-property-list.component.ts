import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DynamicEntityPropertyServiceProxy } from '@shared/service-proxies/service-proxies';
import { SelectAnEntityModalComponent } from '@app/admin/dynamic-properties/select-an-entity-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'dynamic-entity-property-list',
    templateUrl: './dynamic-entity-property-list.component.html'
})
export class DynamicEntityPropertyListComponent extends AppComponentBase implements OnInit {
    @ViewChild('selectAnEntityModal') selectAnEntityModal: SelectAnEntityModalComponent;

    constructor(
        injector: Injector,
        private _dynamicEntityPropertyService: DynamicEntityPropertyServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getDynamicEntityProperties();
    }

    getDynamicEntityProperties(): void {
        this.showMainSpinner();
        this._dynamicEntityPropertyService.getAllEntitiesHasDynamicProperty()
            .subscribe(
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
        this.selectAnEntityModal.show();
    }

    gotoEdit(entityFullName: string): void {
        this._router.navigate(['app/admin/dynamic-entity-property/' + entityFullName]);
    }
}
