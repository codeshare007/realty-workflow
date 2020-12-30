import { Injectable, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfGuid, NotificationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import * as Push from 'push.js'; // if using ES6
import { NotificationSettingsModalComponent } from './notification-settings-modal.component';
import { AppConsts } from '@shared/AppConsts';

export interface IFormattedUserNotification {
    userNotificationId: string;
    text: string;
    time: string;
    creationTime: Date;
    icon: string;
    state: String;
    data: any;
    url: string;
    isUnread: boolean;
    severity: abp.notifications.severity;
    iconFontClass: string;
}

@Injectable()
export class UserNotificationHelper extends AppComponentBase {

    settingsModal: NotificationSettingsModalComponent;

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy
    ) {
        super(injector);
    }

    getUrl(userNotification: abp.notifications.IUserNotification): string {
        switch (userNotification.notification.notificationName) {
            case 'App.NewUserRegistered':
                return '/app/admin/users?filterText=' + userNotification.notification.data.properties.emailAddress;
            case 'App.NewTenantRegistered':
                return '/app/admin/tenants?filterText=' + userNotification.notification.data.properties.tenancyName;
            case 'App.GdprDataPrepared':
                return AppConsts.remoteServiceBaseUrl + '/File/DownloadBinaryFile?id=' + userNotification.notification.data.properties.binaryObjectId + '&contentType=application/zip&fileName=collectedData.zip';
            case 'App.DownloadInvalidImportUsers':
                return AppConsts.remoteServiceBaseUrl + '/File/DownloadTempFile?fileToken=' + userNotification.notification.data.properties.fileToken + '&fileType=' + userNotification.notification.data.properties.fileType + '&fileName=' + userNotification.notification.data.properties.fileName;
            //Add your custom notification names to navigate to a URL when user clicks to a notification.
        }

        //No url for this notification
        return '';
    }

    /* PUBLIC functions ******************************************/

    getUiIconBySeverity(severity: abp.notifications.severity): string {
        switch (severity) {
            case abp.notifications.severity.SUCCESS:
                return 'fas fa-check-circle';
            case abp.notifications.severity.WARN:
                return 'fas fa-exclamation-triangle';
            case abp.notifications.severity.ERROR:
                return 'fas fa-exclamation-circle';
            case abp.notifications.severity.FATAL:
                return 'fas fa-bomb';
            case abp.notifications.severity.INFO:
            default:
                return 'fas fa-info-circle';
        }
    }

    getIconFontClassBySeverity(severity: abp.notifications.severity): string {
        switch (severity) {
            case abp.notifications.severity.SUCCESS:
                return ' text-success';
            case abp.notifications.severity.WARN:
                return ' text-warning';
            case abp.notifications.severity.ERROR:
                return ' text-danger';
            case abp.notifications.severity.FATAL:
                return ' text-danger';
            case abp.notifications.severity.INFO:
            default:
                return ' text-info';
        }
    }

    format(userNotification: abp.notifications.IUserNotification, truncateText?: boolean): IFormattedUserNotification {
        let formatted: IFormattedUserNotification = {
            userNotificationId: userNotification.id,
            text: abp.notifications.getFormattedMessageFromUserNotification(userNotification),
            time: moment(userNotification.notification.creationTime).format('YYYY-MM-DD HH:mm:ss'),
            creationTime: userNotification.notification.creationTime,
            icon: this.getUiIconBySeverity(userNotification.notification.severity),
            state: abp.notifications.getUserNotificationStateAsString(userNotification.state),
            data: userNotification.notification.data,
            url: this.getUrl(userNotification),
            isUnread: userNotification.state === abp.notifications.userNotificationState.UNREAD,
            severity: userNotification.notification.severity,
            iconFontClass: this.getIconFontClassBySeverity(userNotification.notification.severity)
        };

        if (truncateText || truncateText === undefined) {
            formatted.text = abp.utils.truncateStringWithPostfix(formatted.text, 100);
        }

        return formatted;
    }

    show(userNotification: abp.notifications.IUserNotification): void {
        let url = this.getUrl(userNotification);
        //Application notification
        abp.notifications.showUiNotifyForUserNotification(userNotification, {
            onOpen: (toast) => {
                toast.addEventListener('click', () => {
                    //Take action when user clicks to live toastr notification
                    if (url) {
                        location.href = url;
                    }
                });
            }
        });
        if (Push.default.Permission.has()) {
            //Desktop notification
            Push.default.create('Realty', {
                body: this.format(userNotification).text,
                icon: abp.appPath + 'assets/common/images/app-logo-on-dark-sm.svg',
                timeout: 6000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        }
    }

    setAllAsRead(callback?: () => void): void {
        this._notificationService.setAllNotificationsAsRead().subscribe(() => {
            abp.event.trigger('app.notifications.refresh');
            if (callback) {
                callback();
            }
        });
    }

    setAsRead(userNotificationId: string, callback?: (userNotificationId: string) => void): void {
        const input = new EntityDtoOfGuid();
        input.id = userNotificationId;
        this._notificationService.setNotificationAsRead(input).subscribe(() => {
            abp.event.trigger('app.notifications.read', userNotificationId);
            if (callback) {
                callback(userNotificationId);
            }
        });
    }

    openSettingsModal(): void {
        this.settingsModal.show();
    }
}
