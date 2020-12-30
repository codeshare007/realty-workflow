import { Component, Input, OnInit } from '@angular/core';
import { ChatMessageDto, ChatServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from 'shared/AppConsts';
import { LocalStorageService } from '@shared/utils/local-storage.service';

@Component({
    selector: 'chat-message',
    templateUrl: './chat-message.component.html'
})
export class ChatMessageComponent implements OnInit {

    @Input()
    message: ChatMessageDto;

    chatMessage: string;
    chatMessageType: string;
    fileName: string;
    fileContentType: string;

    constructor(
        private _chatService: ChatServiceProxy,
        private _localStorageService: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        this.setChatMessageType();
    }

    private setChatMessageType(): void {
        const self = this;
        this._localStorageService.getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
            let encryptedAuthToken = value?.token;
            if (self.message.message.startsWith('[image]')) {
                self.chatMessageType = 'image';

                let image = JSON.parse(self.message.message.substring('[image]'.length));
                self.chatMessage = AppConsts.remoteServiceBaseUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    image.id +
                    '&fileName=' +
                    image.name +
                    '&contentType=' +
                    image.contentType + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);

            } else if (self.message.message.startsWith('[file]')) {
                self.chatMessageType = 'file';

                let file = JSON.parse(self.message.message.substring('[file]'.length));
                self.chatMessage = AppConsts.remoteServiceBaseUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    file.id +
                    '&fileName=' +
                    file.name +
                    '&contentType=' +
                    file.contentType + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);

                    self.fileName = file.name;
            } else if (self.message.message.startsWith('[link]')) {
                self.chatMessageType = 'link';
                let linkMessage = JSON.parse(self.message.message.substring('[link]'.length));
                self.chatMessage = linkMessage.message == null ? '' : linkMessage.message;
            } else {
                self.chatMessageType = 'text';
                self.chatMessage = self.message.message;
            }
        });
    }
}
