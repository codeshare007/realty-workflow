import { Component, Injector, OnInit, forwardRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetUsersInput, UserSearchDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'user-combo',
    template:
        `
    <select class="form-control" [formControl]="selectedUser">
        <option value="">{{ label | localize}}</option>
        <option *ngFor="let user of users" [value]="user.publicId">{{user.name}}</option>
    </select>`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UserComboComponent),
        multi: true,
    }]
})
export class UserComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    @Input() label: string = 'AllUsers';
    @Input() userRole: string;
    
    users: UserSearchDto[] = [];
    selectedUser = new FormControl('');

    onTouched: any = () => { };

    constructor(
        private _userService: UserServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        let input = new GetUsersInput();
        input.roleName = this.userRole;

        this._userService.searchUser(input).subscribe(users => {
            this.users = users;
        });
    }

    writeValue(obj: any): void {
        if (this.selectedUser) {
            this.selectedUser.setValue(obj);
        }
    }

    registerOnChange(fn: any): void {
        this.selectedUser.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.selectedUser.disable();
        } else {
            this.selectedUser.enable();
        }
    }
}
