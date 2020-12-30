import { Injectable, Injector, NgZone } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { AppComponentBase } from '@shared/common/app-component-base';

@Injectable()
export class DocumentSignalrService extends AppComponentBase {

    constructor(
        injector: Injector,
        public _zone: NgZone
    ) {
        super(injector);
    }

    documentHub: HubConnection;
    isDocumentHubConnected = false;

    configureConnection(connection): void {
        // Set the common hub
        this.documentHub = connection;

        // Reconnect loop
        let reconnectTime = 5000;
        let tries = 1;
        let maxTries = 8;
        function start() {
            return new Promise(function (resolve, reject) {
                if (tries > maxTries) {
                    reject();
                } else {
                    connection.start()
                        .then(resolve)
                        .then(() => {
                            reconnectTime = 5000;
                            tries = 1;
                        })
                        .catch(() => {
                            setTimeout(() => {
                                start().then(resolve);
                            }, reconnectTime);
                            reconnectTime *= 2;
                            tries += 1;
                        });
                }
            });
        }

        // Reconnect if hub disconnects
        connection.onclose(e => {
            this.isDocumentHubConnected = false;

            if (e) {
                abp.log.debug('Document Hub connection closed with error: ' + e);
            } else {
                abp.log.debug('Document Hub disconnected');
            }

            start().then(() => {
                this.isDocumentHubConnected = true;
            });
        });

        // Register to get notifications
        this.registerDocumentHubEvents(connection);
    }

    registerDocumentHubEvents(connection): void {
        connection.on('getDocumentStatusChanged', (notification) => {
            abp.event.trigger('app.document.notification.received', notification);
        });


    }

    init(): void {
        this._zone.runOutsideAngular(() => {
            abp.signalr.connect();
            abp.signalr.startConnection(abp.appPath + 'signalr-document', connection => {
                this.configureConnection(connection);
            }).then(() => {
                abp.event.trigger('app.document.connected');
                this.isDocumentHubConnected = true;
            });
        });
    }
}
