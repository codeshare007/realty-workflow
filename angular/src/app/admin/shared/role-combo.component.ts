import { Component, Injector, OnInit, forwardRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'role-combo',
    template:
        `
    <select class="form-control" [formControl]="selectedRole">
        <option value="">{{'FilterByRole' | localize}}</option>
        <option *ngFor="let role of roles" [value]="role.id">{{role.displayName}}</option>
    </select>`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RoleComboComponent),
        multi: true,
    }]
})
export class RoleComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    roles: RoleListDto[] = [];
    selectedRole = new FormControl('');

    onTouched: any = () => { };

    constructor(
        private _roleService: RoleServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._roleService.getRoles(undefined).subscribe(result => {
            this.roles = result.items;
        });
    }

    writeValue(obj: any): void {
        if (this.selectedRole) {
            this.selectedRole.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.selectedRole.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.selectedRole.disable();
        } else {
            this.selectedRole.enable();
        }
    }
}
