import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, UserNotification, UserNotificationState } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { IFormattedUserNotification, UserNotificationHelper } from './UserNotificationHelper';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NotificationsComponent extends AppComponentBase {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    readStateFilter = 'ALL';
    dateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];
    loading = false;

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper
    ) {
        super(injector);
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    setAsRead(record: any): void {
        this.setNotificationAsRead(record, () => {
            this.reloadPage();
        });
    }

    isRead(record: any): boolean {
        return record.formattedNotification.state === 'READ';
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }

    formatRecord(record: any): IFormattedUserNotification {
        return this._userNotificationHelper.format(record, false);
    }

    formatNotification(record: any): string {
        const formattedRecord = this.formatRecord(record);
        return abp.utils.truncateStringWithPostfix(formattedRecord.text, 120);
    }

    formatNotifications(records: any[]): any[] {
        const formattedRecords = [];
        for (const record of records) {
            record.formattedNotification = this.formatRecord(record);
            formattedRecords.push(record);
        }
        return formattedRecords;
    }

    truncateString(text: any, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }

    getNotifications(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._notificationService.getUserNotifications(
            this.readStateFilter === 'ALL' ? undefined : UserNotificationState.Unread,
            moment(this.dateRange[0]),
            moment(this.dateRange[1]).endOf('day'),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe((result) => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = this.formatNotifications(result.items);
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead(() => {
            this.getNotifications();
        });
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: UserNotification, callback: () => void): void {
        this._userNotificationHelper
            .setAsRead(userNotification.id, () => {
                if (callback) {
                    callback();
                }
            });
    }

    deleteNotification(userNotification: UserNotification): void {
        this.message.confirm(
            this.l('NotificationDeleteWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._notificationService.deleteNotification(userNotification.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    deleteNotifications() {
        this.message.confirm(
            this.l('DeleteListedNotificationsWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._notificationService.deleteAllUserNotifications(
                        this.readStateFilter === 'ALL' ? undefined : UserNotificationState.Unread,
                        moment(this.dateRange[0]),
                        moment(this.dateRange[1]).endOf('day')).subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    public getRowClass(formattedRecord: IFormattedUserNotification): string {
        return formattedRecord.state === 'READ' ? 'notification-read' : '';
    }

    getNotificationTextBySeverity(severity: abp.notifications.severity): string {
        switch (severity) {
            case abp.notifications.severity.SUCCESS:
                return this.l('Success');
            case abp.notifications.severity.WARN:
                return this.l('Warning');
            case abp.notifications.severity.ERROR:
                return this.l('Error');
            case abp.notifications.severity.FATAL:
                return this.l('Fatal');
            case abp.notifications.severity.INFO:
            default:
                return this.l('Info');
        }
    }
}
