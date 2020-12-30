import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PermissionTreeComponent } from '../shared/permission-tree.component';

@Component({
    selector: 'editUserPermissionsModal',
    templateUrl: './edit-user-permissions-modal.component.html'
})
export class EditUserPermissionsModalComponent extends AppComponentBase {

    @ViewChild('editModal', { static: true }) modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    saving = false;
    resettingPermissions = false;

    userId: number;
    userName: string;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy
    ) {
        super(injector);
    }

    show(userId: number, userName?: string): void {
        this.userId = userId;
        this.userName = userName;

        // this._userService.getUserPermissionsForEdit(userId).subscribe(result => {
        //     this.permissionTree.editData = result;
        //     this.modal.show();
        // });
    }

    save(): void {
        //let input = new UpdateUserPermissionsInput();

        // input.id = this.userId;
        // input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();

        // this.saving = true;
        // this._userService.updateUserPermissions(input)
        //     .pipe(finalize(() => { this.saving = false; }))
        //     .subscribe(() => {
        //         this.notify.info(this.l('SavedSuccessfully'));
        //         this.close();
        //     });
    }

    resetPermissions(): void {

        // let input = new EntityDtoOfInt64();

        // input.id = this.userId;

        // this.resettingPermissions = true;
        // this._userService.resetUserSpecificPermissions(input).subscribe({
        //     next: () => {
        //         this.notify.info(this.l('ResetSuccessfully'));
        //         this._userService.getUserPermissionsForEdit(this.userId).subscribe(result => {
        //             this.permissionTree.editData = result;
        //         });
        //     },
        //     complete: () => {
        //         this.resettingPermissions = false;
        //     }
        // });
    }

    close(): void {
        this.modal.hide();
    }
}
