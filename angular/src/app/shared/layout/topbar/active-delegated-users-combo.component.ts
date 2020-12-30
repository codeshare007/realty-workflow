import { Component, Injector, OnInit, forwardRef, HostBinding, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserDelegationServiceProxy, UserDelegationDto } from '@shared/service-proxies/service-proxies';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImpersonationService } from '@app/admin/users/impersonation.service';

@Component({
    selector: 'active-delegated-users-combo',
    template:
        `
        <div *ngIf="delegations?.length" class="topbar-item active-user-delegations">
        <div [class]="customStyle">
            <select class="form-control form-control-sm" (change)="switchToDelegatedUser($event)" [(ngModel)]="selectedUserDelegationId">
                <option selected="selected" value="0">{{'SwitchToUser' | localize}}</option>
                <option *ngFor="let delegation of delegations" [value]="delegation.id" [attr.data-username]="delegation.username">{{delegation.username}} ({{'ExpiresAt' | localize : (delegation.endTime|momentFormat:'L LT')}})</option>
            </select>
        </div>
    </div>`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ActiveDelegatedUsersComboComponent),
        multi: true
    }]
})
export class ActiveDelegatedUsersComboComponent extends AppComponentBase implements OnInit {

    delegations: UserDelegationDto[] = [];
    selectedUserDelegationId = 0;
    currentSelectedUserDelegationId = 0;
    @HostBinding('style.display') public display = 'flex';

    @Input() customStyle = 'btn btn-clean btn-lg mr-1 mt-2';

    constructor(
        private _userDelegationService: UserDelegationServiceProxy,
        private _impersonationService: ImpersonationService,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this._userDelegationService.getActiveUserDelegations().subscribe(result => {
            this.delegations = result;
        });
    }

    switchToDelegatedUser($event): void {
        let username = $event.target.selectedOptions[0].getAttribute('data-username');

        this.message.confirm(
            this.l('SwitchToDelegatedUserWarningMessage', username),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this.currentSelectedUserDelegationId = this.selectedUserDelegationId;
                    this._impersonationService.delegatedImpersonate(this.selectedUserDelegationId, this.appSession.tenantId);
                } else {
                    this.selectedUserDelegationId = this.currentSelectedUserDelegationId;
                }
            }
        );
    }
}
