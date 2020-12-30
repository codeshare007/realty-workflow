import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserDelegationServiceProxy, UserDelegationDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateNewUserDelegationModalComponent } from './create-new-user-delegation-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'userDelegationsModal',
    templateUrl: './user-delegations-modal.component.html'
})
export class UserDelegationsModalComponent extends AppComponentBase {

    @ViewChild('userDelegationsModal', { static: true }) modal: ModalDirective;
    @ViewChild('createNewUserDelegation', { static: true }) createNewUserDelegation: CreateNewUserDelegationModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _userDelegationService: UserDelegationServiceProxy
    ) {
        super(injector);
    }

    getUserDelegations(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();

        this._userDelegationService.getDelegatedUsers(
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getSorting(this.dataTable)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    deleteUserDelegation(userDelegation: UserDelegationDto): void {
        this.message.confirm(
            this.l('UserDelegationDeleteWarningMessage', userDelegation.username),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._userDelegationService.removeDelegation(userDelegation.id).subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    manageUserDelegations(): void {
        this.createNewUserDelegation.show();
    }

    show(): void {
        this.modal.show();
    }

    onShown(): void {
        this.getUserDelegations(null);
    }

    close(): void {
        this.modal.hide();
        this.modalClose.emit(null);
    }
}
