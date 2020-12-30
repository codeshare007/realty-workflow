import { AbpMultiTenancyService } from 'abp-ng2-module';
import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LinkedUserDto, UnlinkUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { LinkAccountModalComponent } from './link-account-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'linkedAccountsModal',
    templateUrl: './linked-accounts-modal.component.html'
})
export class LinkedAccountsModalComponent extends AppComponentBase {

    @ViewChild('linkedAccountsModal', {static: true}) modal: ModalDirective;
    @ViewChild('linkAccountModal', {static: true}) linkAccountModal: LinkAccountModalComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;

    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private _userLinkService: UserLinkServiceProxy,
        private _linkedAccountService: LinkedAccountService
    ) {
        super(injector);
    }

    getLinkedUsers(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();

        this._userLinkService.getLinkedUsers(
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getSorting(this.dataTable)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    getShownLinkedUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    deleteLinkedUser(linkedUser: LinkedUserDto): void {
        this.message.confirm(
            this.l('LinkedUserDeleteWarningMessage', linkedUser.username),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    const unlinkUserInput = new UnlinkUserInput();
                    unlinkUserInput.userId = linkedUser.id;
                    unlinkUserInput.tenantId = linkedUser.tenantId;

                    this._userLinkService.unlinkUser(unlinkUserInput).subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyUnlinked'));
                    });
                }
            }
        );
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    manageLinkedAccounts(): void {
        this.linkAccountModal.show();
    }

    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    show(): void {
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.modalClose.emit(null);
    }
}
