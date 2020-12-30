import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';
import { IUserWithOrganizationUnit } from './user-with-organization-unit';
import { IUsersWithOrganizationUnit } from './users-with-organization-unit';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'organization-unit-members',
    templateUrl: './organization-unit-members.component.html'
})
export class OrganizationUnitMembersComponent extends AppComponentBase implements OnInit {

    @Output() memberRemoved = new EventEmitter<IUserWithOrganizationUnit>();
    @Output() membersAdded = new EventEmitter<IUsersWithOrganizationUnit>();

    @ViewChild('addMemberModal', {static: true}) addMemberModal: AddMemberModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    private _organizationUnit: IBasicOrganizationUnitInfo = null;

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy
    ) {
        super(injector);
    }

    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (!ou) {
            this._organizationUnit = null;
            return;
        }

        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        this.addMemberModal.organizationUnitId = ou.id;
        if (ou) {
            this.refreshMembers();
        }
    }

    ngOnInit(): void {

    }

    getOrganizationUnitUsers(event?: LazyLoadEvent) {
        if (!this._organizationUnit) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._organizationUnitService.getOrganizationUnitUsers(
            this._organizationUnit.id,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    refreshMembers(): void {
        this.reloadPage();
    }

    openAddMemberModal(): void {
        this.addMemberModal.show();
    }

    removeMember(user: OrganizationUnitUserListDto): void {
        this.message.confirm(
            this.l('RemoveUserFromOuWarningMessage', user.userName, this.organizationUnit.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._organizationUnitService
                        .removeUserFromOrganizationUnit(user.id, this.organizationUnit.id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyRemoved'));
                            this.memberRemoved.emit({
                                userId: user.id,
                                ouId: this.organizationUnit.id
                            });

                            this.refreshMembers();
                        });
                }
            }
        );
    }

    addMembers(data: any): void {
        this.membersAdded.emit({
            userIds: data.userIds,
            ouId: data.ouId
        });

        this.refreshMembers();
    }
}
