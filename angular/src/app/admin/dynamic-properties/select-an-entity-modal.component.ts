import {Component, EventEmitter, Injector, Output, ViewChild} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    DynamicEntityPropertyDefinitionServiceProxy,
    DynamicEntityPropertyServiceProxy
} from '@shared/service-proxies/service-proxies';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'select-and-entity-modal',
    templateUrl: './select-an-entity-modal.component.html'
})
export class SelectAnEntityModalComponent extends AppComponentBase {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('createModal') modal: ModalDirective;

    allEntities: string[];
    initialized = false;
    saving = false;
    entityFullName: string;

    constructor(
        injector: Injector,
        private _dynamicEntityPropertyService: DynamicEntityPropertyServiceProxy,
        private _dynamicEntityPropertyDefinitionService: DynamicEntityPropertyDefinitionServiceProxy
    ) {
        super(injector);
    }

    private initialize() {
        if (this.initialized) {
            return;
        }

        this.showMainSpinner();
        let allEntitiesObservable = this._dynamicEntityPropertyDefinitionService.getAllEntities();
        let allEntitiesHasPropertyObservable = this._dynamicEntityPropertyService.getAllEntitiesHasDynamicProperty();

        forkJoin([allEntitiesObservable, allEntitiesHasPropertyObservable])
            .subscribe(
                ([allEntities, allEntitiesHasProperty]) => {
                    this.allEntities = allEntities.filter(function (element) {
                        return allEntitiesHasProperty.items.map(item => item.entityFullName).indexOf(element) === -1;
                    });
                    this.hideMainSpinner();
                    this.initialized = true;
                },
                (err) => {
                    this.hideMainSpinner();
                }
            );
    }

    show(): void {
        this.initialize();
        this.modal.show();
    }

    save(): void {
        this.saving = true;
        this.showMainSpinner();
        this.modalSave.emit(this.entityFullName);
    }

    close(): void {
        this.modal.hide();
    }
}

