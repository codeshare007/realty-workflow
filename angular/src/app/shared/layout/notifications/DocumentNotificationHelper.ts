import { Injectable, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as Push from 'push.js'; // if using ES6

export class DocumentNotification {
    tenantId: number;
    userId: number;
    name: string;
    text: string;
    time: Moment;
    severity: abp.notifications.severity;
    documentId: string;
}

export class IFormattedDocumentNotification {
    text: string;
    time: string;
    url: string;
    severity: abp.notifications.severity;
    iconFontClass: string;
    // icon: string;
}

@Injectable()
export class DocumentNotificationHelper extends AppComponentBase {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    getUrl(documentNotification: DocumentNotification): string {
        switch (documentNotification.name) {
            case 'Documents.Notifications.LibraryForms.ProcessingCompleted':
                return `/app/admin/forms-library/${documentNotification.documentId}/edit-document`;
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

    format(notification: DocumentNotification, truncateText?: boolean): IFormattedDocumentNotification {
        let formatted: IFormattedDocumentNotification = {
            text: notification.text,
            time: moment(notification.time).format('YYYY-MM-DD HH:mm:ss'),
            // icon: this.getUiIconBySeverity(notification.severity),
            url: this.getUrl(notification),
            severity: notification.severity,
            iconFontClass: this.getIconFontClassBySeverity(notification.severity)
        };

        if (truncateText || truncateText === undefined) {
            formatted.text = abp.utils.truncateStringWithPostfix(formatted.text, 100);
        }

        return formatted;
    }

    show(notification: DocumentNotification): void {
        let url = this.getUrl(notification);
        let uiNotifyFunc = abp.notifications.getUiNotifyFuncBySeverity(notification.severity);
        //Application notification
        uiNotifyFunc(notification.text, undefined, {
            onOpen: (toast) => {
                toast.addEventListener('click', () => {
                    //Take action when user clicks to live toastr notification
                    if (url) {
                        location.href = url;
                    }
                });
            },
            showClass: {
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show',
            },
            hideClass: {
                popup: 'swal2-hide',
                backdrop: 'swal2-backdrop-hide',
            },
            toast: true,
            timer: 10000,
            width: '250px',
        });
        if (Push.default.Permission.has()) {
            //Desktop notification
            Push.default.create('Realty', {
                body: this.format(notification).text,
                icon: abp.appPath + 'assets/common/images/app-logo-on-dark-sm.svg',
                timeout: 6000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        }
    }
}
