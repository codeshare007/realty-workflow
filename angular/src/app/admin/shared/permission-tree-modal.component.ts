import { Component, Injector, ViewChild, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TreeNode } from 'primeng/api';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PermissionTreeComponent } from './permission-tree.component';
import { PermissionServiceProxy, FlatPermissionDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'permission-tree-modal',
    templateUrl: './permission-tree-modal.component.html',
})
export class PermissionTreeModalComponent extends AppComponentBase implements OnInit {
    @Input() dontAddOpenerButton: boolean;
    @Input() singleSelect: boolean;
    @Output() onModalclose = new EventEmitter<string[]>();

    @ViewChild('permissionTreeModal', { static: true }) permissionTreeModal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    selectedPermissions: TreeNode[] = [];
    NumberOfFilteredPermission = 0;
    constructor(
        injector: Injector,
        private _permissionService: PermissionServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadAllPermissionsToFilterTree();
    }

    private loadAllPermissionsToFilterTree() {
        let treeModel: FlatPermissionDto[] = [];
        this._permissionService.getAllPermissions().subscribe(result => {
            if (result.items) {
                result.items.forEach(item => {
                    treeModel.push(new FlatPermissionDto({
                        name: item.name,
                        description: item.description,
                        displayName: item.displayName,
                        isGrantedByDefault: item.isGrantedByDefault,
                        parentName: item.parentName
                    }));
                });
            }

            this.permissionTree.editData = { permissions: treeModel, grantedPermissionNames: [] };
        });
    }

    openPermissionTreeModal(): void {
        this.permissionTreeModal.show();
    }

    closePermissionTreeModal(): void {
        let selections = this.getSelectedPermissions();
        this.NumberOfFilteredPermission = selections.length;

        this.onModalclose.emit(selections);
        this.permissionTreeModal.hide();

        abp.notify.success(this.l('XCountPermissionFiltered', this.NumberOfFilteredPermission));
    }

    getSelectedPermissions(): string[] {
        if (!this.permissionTree) {
            return [];
        }

        let permissions = this.permissionTree.getGrantedPermissionNames()
            .filter((test, index, array) =>
                index === array.findIndex((findTest) =>
                    findTest === test
                )
            );

        return permissions;
    }
}
