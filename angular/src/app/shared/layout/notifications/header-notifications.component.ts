import { Component, Injector, Input, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { NotificationServiceProxy, UserNotification } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { DocumentNotificationHelper } from './DocumentNotificationHelper';
import { IFormattedUserNotification, UserNotificationHelper } from './UserNotificationHelper';

@Component({
    templateUrl: './header-notifications.component.html',
    selector: 'header-notifications',
    encapsulation: ViewEncapsulation.None
})
export class HeaderNotificationsComponent extends AppComponentBase implements OnInit, OnDestroy {

    DocumentNotificationReceived = 'app.document.notification.received';

    notifications: IFormattedUserNotification[] = [];
    unreadNotificationCount = 0;
    @Input() isDropup = false;
    @Input() customStyle = 'btn btn-icon btn-dropdown btn-clean btn-lg mr-1';

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
        private _documentNotificationHelper: DocumentNotificationHelper,
        public _zone: NgZone
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadNotifications();
        this.registerToEvents();
    }

    ngOnDestroy(): void {
        
    }

    loadNotifications(): void {
        if (UrlHelper.isInstallUrl(location.href)) {
            return;
        }

        this._notificationService.getUserNotifications(undefined, undefined, undefined, 3, 0).subscribe(result => {
            this.unreadNotificationCount = result.unreadCount;
            this.notifications = [];
            _.forEach(result.items, (item: UserNotification) => {
                this.notifications.push(this._userNotificationHelper.format(<any>item));
            });
        });
    }

    registerToEvents() {
        let self = this;

        function onNotificationReceived(userNotification) {
            self._userNotificationHelper.show(userNotification);
            self.loadNotifications();
        }

        abp.event.on('abp.notifications.received', userNotification => {
            self._zone.run(() => {
                onNotificationReceived(userNotification);
            });
        });

        function onNotificationsRefresh() {
            self.loadNotifications();
        }

        abp.event.on('app.notifications.refresh', () => {
            self._zone.run(() => {
                onNotificationsRefresh();
            });
        });

        function onNotificationsRead(userNotificationId) {
            for (let i = 0; i < self.notifications.length; i++) {
                if (self.notifications[i].userNotificationId === userNotificationId) {
                    self.notifications[i].state = 'READ';
                }
            }

            self.unreadNotificationCount -= 1;
        }

        abp.event.on('app.notifications.read', userNotificationId => {
            self._zone.run(() => {
                onNotificationsRead(userNotificationId);
            });
        });

        // Document Hub
        abp.event.on(this.DocumentNotificationReceived, this._onDocumentNotificationReceived);
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead();
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: IFormattedUserNotification): void {
        this._userNotificationHelper.setAsRead(userNotification.userNotificationId);
    }

    gotoUrl(url): void {
        if (url) {
            location.href = url;
        }
    }

    unsubscribeFromEvents() {
        abp.event.off(this.DocumentNotificationReceived, this._onDocumentNotificationReceived);
    }

    private _onDocumentNotificationReceived = (documentNotification) => {
        this._zone.run(() => {
            this._documentNotificationHelper.show(documentNotification);
        });
    }
}
