import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FlatPermissionWithLevelDto, PermissionServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'permission-combo',
    template:
        `<select class="form-control" [formControl]="selectedPermission">
        <option value="">{{'FilterByPermission' | localize}}</option>
        <option *ngFor="let permission of permissions" [value]="permission.name">{{permission.displayName}}</option>
    </select>`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PermissionComboComponent),
        multi: true,
    }]
})
export class PermissionComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    permissions: FlatPermissionWithLevelDto[] = [];
    selectedPermission = new FormControl('');

    onTouched: any = () => { };

    constructor(
        private _permissionService: PermissionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._permissionService.getAllPermissions().subscribe(result => {
            _.forEach(result.items, item => {
                item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
            });

            this.permissions = result.items;
        });
    }

    writeValue(obj: any): void {
        if (this.selectedPermission) {
            this.selectedPermission.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.selectedPermission.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.selectedPermission.disable();
        } else {
            this.selectedPermission.enable();
        }
    }
}
