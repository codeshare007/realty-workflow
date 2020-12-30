import {Component, EventEmitter, Output, ViewChild, Injector, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    DynamicPropertyServiceProxy,
    DynamicPropertyDto,
    DynamicEntityPropertyDefinitionServiceProxy
} from '@shared/service-proxies/service-proxies';
import {Observable} from 'rxjs';
import {PermissionTreeModalComponent} from '@app/admin/shared/permission-tree-modal.component';

@Component({
    selector: 'create-or-edit-dynamic-property-modal',
    templateUrl: './create-or-edit-dynamic-property-modal.component.html'
})
export class CreateOrEditDynamicPropertyModalComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('permissionFilterTreeModal', {static: true}) permissionFilterTreeModal: PermissionTreeModalComponent;

    dynamicProperty: DynamicPropertyDto;
    allIputTypes: string[];
    dynamicPropertyId: number;
    active: boolean;
    loading = true;
    saving = false;

    constructor(
        injector: Injector,
        private _dynamicPropertyService: DynamicPropertyServiceProxy,
        private _dynamicEntityPropertyDefinitionServiceProxy: DynamicEntityPropertyDefinitionServiceProxy
    ) {
        super(injector);
    }

    public show(dynamicPropertyId?: number): void {
        this.dynamicPropertyId = dynamicPropertyId;
        if (!dynamicPropertyId) {
            this.dynamicProperty = new DynamicPropertyDto();
            this.active = true;
            this.modal.show();
            return;
        }

        this.showMainSpinner();
        this._dynamicPropertyService.get(dynamicPropertyId)
            .subscribe(result => {
                this.dynamicProperty = result;
                this.active = true;
                this.modal.show();
                this.hideMainSpinner();
            }, (e) => {
                this.hideMainSpinner();
            });
    }

    save(): void {
        this.saving = true;
        let observable: Observable<void>;
        if (!this.dynamicProperty.id) {
            observable = this._dynamicPropertyService.add(this.dynamicProperty);
        } else {
            observable = this._dynamicPropertyService.update(this.dynamicProperty);
        }

        this.showMainSpinner();
        observable.subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.hideMainSpinner();
            this.modalSave.emit(null);
            this.modal.hide();
            this.saving = false;
        }, (e) => {
            this.hideMainSpinner();
            this.saving = false;
        });
    }

    ngOnInit(): void {
        this._dynamicEntityPropertyDefinitionServiceProxy.getAllAllowedInputTypeNames().subscribe((data) => {
            this.allIputTypes = data;
            this.loading = false;
        });
    }

    close(): void {
        this.modal.hide();
    }

    openPermissionTreeModal(): void {
        this.permissionFilterTreeModal.openPermissionTreeModal();
    }

    onPermissionSelected(selectedValues: string[]): void {
        this.dynamicProperty.permission = selectedValues[0];
    }
}
