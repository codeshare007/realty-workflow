import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Input, Output, ViewChild, ViewEncapsulation, NgZone, HostBinding, ElementRef, HostListener } from '@angular/core';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DomHelper } from '@shared/helpers/DomHelper';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { finalize } from 'rxjs/operators';

import {
    BlockUserInput,
    ChatSide,
    ChatServiceProxy,
    CommonLookupServiceProxy,
    CreateFriendshipRequestByUserNameInput,
    CreateFriendshipRequestInput,
    FindUsersInput,
    FriendDto,
    FriendshipState,
    FriendshipServiceProxy,
    MarkAllUnreadMessagesOfUserAsReadInput,
    NameValueDto,
    ProfileServiceProxy,
    UnblockUserInput,
    UserLoginInfoDto,
    ChatMessageReadState
} from '@shared/service-proxies/service-proxies';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ChatFriendDto } from './ChatFriendDto';
import { ChatSignalrService } from './chat-signalr.service';

@Component({
    templateUrl: './chat-bar.component.html',
    selector: 'chat-bar',
    styleUrls: ['./chat-bar.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ChatBarComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @Output() onProgress: EventEmitter<any> = new EventEmitter();
    @Input() userLookupModal: CommonLookupModalComponent;

    public progress = 0;
    uploadUrl: string;
    isFileSelected = false;

    @HostBinding('attr.ktOffcanvas')

    @HostBinding('style.overflow') styleOverflow: any = 'hidden';

    mQuickSidebarOffcanvas: any;

    @ViewChild('ChatMessage', { static: true }) chatMessageInput: ElementRef;
    @ViewChild('chatScrollBar', { static: true }) chatScrollBar;

    @ViewChild('chatImageUpload', { static: false }) chatImageUpload: FileUpload;
    @ViewChild('chatFileUpload', { static: false }) chatFileUpload: FileUpload;

    friendDtoState: typeof FriendshipState = FriendshipState;

    friends: ChatFriendDto[];
    currentUser: UserLoginInfoDto = this.appSession.user;
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    chatMessage = '';

    tenantToTenantChatAllowed = false;
    tenantToHostChatAllowed = false;
    interTenantChatAllowed = false;
    sendingMessage = false;
    loadingPreviousUserMessages = false;
    userNameFilter = '';
    serverClientTimeDifference = 0;
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    appChatSide: typeof ChatSide = ChatSide;
    appChatMessageReadState: typeof ChatMessageReadState = ChatMessageReadState;

    _isOpen: boolean;
    _pinned = false;
    _selectedUser: ChatFriendDto = new ChatFriendDto();

    @HostListener('mouseleave') mouseleave() {
        if (!this.pinned && this.mQuickSidebarOffcanvas) {
            this.mQuickSidebarOffcanvas.hide();
        }
    }

    get chatUserSearchHint(): string {
        return this.l('ChatUserSearch_Hint');
    }

    set isOpen(newValue: boolean) {
        if (newValue === this._isOpen) {
            return;
        }

        this._localStorageService.setItem('app.chat.isOpen', newValue);
        this._isOpen = newValue;

        if (newValue) {
            this.markAllUnreadMessagesOfUserAsRead(this.selectedUser);
        }
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    set pinned(newValue: boolean) {
        if (newValue === this._pinned) {
            return;
        }

        this._pinned = newValue;
        this._localStorageService.setItem('app.chat.pinned', newValue);
    }
    get pinned(): boolean {
        return this._pinned;
    }

    set selectedUser(newValue: ChatFriendDto) {
        if (newValue === this._selectedUser) {
            return;
        }

        this._selectedUser = newValue;

        //NOTE: this is a fix for localForage is not able to store user with messages array filled
        if (newValue.messages) {
            newValue.messages = [];
            newValue.messagesLoaded = false;
        }
        this._localStorageService.setItem('app.chat.selectedUser', newValue);
    }
    get selectedUser(): ChatFriendDto {
        return this._selectedUser;
    }

    constructor(
        private el: ElementRef,
        injector: Injector,
        private _friendshipService: FriendshipServiceProxy,
        private _chatService: ChatServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _localStorageService: LocalStorageService,
        private _chatSignalrService: ChatSignalrService,
        private _profileService: ProfileServiceProxy,
        private _httpClient: HttpClient,
        public _zone: NgZone) {
        super(injector);
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Chat/UploadFile';
    }

    shareCurrentLink() {
        this.chatMessage = '[link]{"message":"' + window.location.href + '"}';
        this.sendMessage();
    }

    uploadImage(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.chatImageUpload.clear()))
            .subscribe(response => {
                this.chatMessage = '[image]{"id":"' + response.result.id + '", "name":"' + response.result.name + '", "contentType":"' + response.result.contentType + '"}';
                this.sendMessage();

                this.isFileSelected = false;
                this.progress = 0;
            });
    }

    uploadFile(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);

        this._httpClient
            .post<any>(this.uploadUrl, formData)
            .pipe(finalize(() => this.chatFileUpload.clear()))
            .subscribe(response => {
                this.chatMessage = '[file]{"id":"' + response.result.id + '", "name":"' + response.result.name + '", "contentType":"' + response.result.contentType + '"}';
                this.sendMessage();

                this.isFileSelected = false;
                this.progress = 0;
            });
    }

    onBeforeSend(event): void {
        this.isFileSelected = true;
        event.xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
            if (e.lengthComputable) {
                this.progress = Math.round((e.loaded * 100) / e.total);
            }

            this.onProgress.emit({ originalEvent: e, progress: this.progress });
        }, false);
    }

    ngOnInit(): void {
        this.init();
    }

    getShownUserName(tenanycName: string, userName: string): string {
        if (!this.isMultiTenancyEnabled) {
            return userName;
        }

        return (tenanycName ? tenanycName : '.') + '\\' + userName;
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    block(user: FriendDto): void {
        const blockUserInput = new BlockUserInput();
        blockUserInput.tenantId = user.friendTenantId;
        blockUserInput.userId = user.friendUserId;

        this._friendshipService.blockUser(blockUserInput).subscribe(() => {
            this.notify.info(this.l('UserBlocked'));
        });
    }

    unblock(user: FriendDto): void {
        const unblockUserInput = new UnblockUserInput();
        unblockUserInput.tenantId = user.friendTenantId;
        unblockUserInput.userId = user.friendUserId;

        this._friendshipService.unblockUser(unblockUserInput).subscribe(() => {
            this.notify.info(this.l('UserUnblocked'));
        });
    }

    markAllUnreadMessagesOfUserAsRead(user: ChatFriendDto): void {
        if (!user || !this.isOpen) {
            return;
        }

        const unreadMessages = _.filter(user.messages, m => m.readState === ChatMessageReadState.Unread);
        const unreadMessageIds = _.map(unreadMessages, 'id');

        if (!unreadMessageIds.length) {
            return;
        }

        const input = new MarkAllUnreadMessagesOfUserAsReadInput();
        input.tenantId = user.friendTenantId;
        input.userId = user.friendUserId;

        this._chatService.markAllUnreadMessagesOfUserAsRead(input).subscribe(() => {
            _.forEach(user.messages, message => {
                if (unreadMessageIds.indexOf(message.id) >= 0) {
                    message.readState = ChatMessageReadState.Read;
                }
            });
        });
    }

    loadPreviousMesssagesOfSelectedUser(): void {
        this._zone.run(() => {
            this.loadMessages(this.selectedUser, null);
        });
    }

    loadMessages(user: ChatFriendDto, callback: any): void {
        this.loadingPreviousUserMessages = true;

        let minMessageId;
        if (user.messages && user.messages.length) {
            minMessageId = _.min(_.map(user.messages, m => m.id));
        }

        this._chatService.getUserChatMessages(user.friendTenantId ? user.friendTenantId : undefined, user.friendUserId, minMessageId)
            .subscribe(result => {
                if (!user.messages) {
                    user.messages = [];
                }

                user.messages = result.items.concat(user.messages);

                this.markAllUnreadMessagesOfUserAsRead(user);

                if (!result.items.length) {
                    user.allPreviousMessagesLoaded = true;
                }

                this.loadingPreviousUserMessages = false;
                if (callback) {
                    callback();
                }
            });
    }

    openSearchModal(userName: string, tenantId?: number): void {
        this.userLookupModal.filterText = userName;
        this.userLookupModal.show();
    }

    addFriendSelected(item: NameValueDto): void {
        const userId = item.value;
        const input = new CreateFriendshipRequestInput();
        input.userId = parseInt(userId);
        input.tenantId = this.appSession.tenant ? this.appSession.tenant.id : null;

        this._friendshipService.createFriendshipRequest(input).subscribe(() => {
            this.userNameFilter = '';
        });
    }

    search(): void {
        const input = new CreateFriendshipRequestByUserNameInput();

        if (this.userNameFilter.indexOf('\\') === -1) {
            input.userName = this.userNameFilter;
        } else {
            const tenancyAndUserNames = this.userNameFilter.split('\\');
            input.tenancyName = tenancyAndUserNames[0];
            input.userName = tenancyAndUserNames[1];
        }

        if (!input.tenancyName || !this.interTenantChatAllowed) {
            const tenantId = this.appSession.tenant ? this.appSession.tenant.id : null;
            this.openSearchModal(input.userName, tenantId);
        } else {
            this._friendshipService.createFriendshipRequestByUserName(input).subscribe(() => {
                this.userNameFilter = '';
            });
        }
    }

    getFriendOrNull(userId: number, tenantId?: number): ChatFriendDto {
        const friends = _.filter(this.friends, friend => friend.friendUserId === userId && friend.friendTenantId === tenantId);
        if (friends.length) {
            return friends[0];
        }

        return null;
    }

    getFilteredFriends(state: FriendshipState, userNameFilter: string): FriendDto[] {
        const foundFriends = _.filter(this.friends, friend => friend.state === state &&
            this.getShownUserName(friend.friendTenancyName, friend.friendUserName)
                .toLocaleLowerCase()
                .indexOf(userNameFilter.toLocaleLowerCase()) >= 0);

        return foundFriends;
    }

    getFilteredFriendsCount(state: FriendshipState): number {
        return _.filter(this.friends, friend => friend.state === state).length;
    }

    getUserNameByChatSide(chatSide: ChatSide): string {
        return chatSide === ChatSide.Sender ?
            this.currentUser.userName :
            this.selectedUser.friendUserName;
    }

    getFixedMessageTime(messageTime: moment.Moment): string {
        return moment(messageTime).add(-1 * this.serverClientTimeDifference, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
    }

    getFriendsAndSettings(callback: any): void {
        this._chatService.getUserChatFriendsWithSettings().subscribe(result => {
            this.friends = (result.friends as ChatFriendDto[]);
            this.serverClientTimeDifference = moment(abp.clock.now()).diff(result.serverTime, 'seconds');

            this.triggerUnreadMessageCountChangeEvent();
            callback();
        });
    }

    scrollToBottom(): void {
        setTimeout(() => {
            this.chatScrollBar.directiveRef.scrollToBottom();
        });
    }

    loadLastState(): void {
        const self = this;

        self._localStorageService.getItem('app.chat.isOpen', (err, isOpen) => {
            self.isOpen = isOpen;

            self._localStorageService.getItem('app.chat.pinned', (err, pinned) => {
                self.pinned = pinned;
            });

            if (isOpen) {
                this.mQuickSidebarOffcanvas.show();
                self._localStorageService.getItem('app.chat.selectedUser', (err, selectedUser) => {
                    if (selectedUser && selectedUser.friendUserId) {
                        self.selectFriend(selectedUser);
                    }
                });
            }
        });
    }

    selectFriend(friend: ChatFriendDto): void {
        const chatUser = this.getFriendOrNull(friend.friendUserId, friend.friendTenantId);
        this.selectedUser = chatUser;

        if (!chatUser) {
            return;
        }

        this.chatMessage = '';

        if (!chatUser.messagesLoaded) {
            this.loadMessages(chatUser, () => {
                chatUser.messagesLoaded = true;
                this.adjustChatScrollbarHeight();
                this.scrollToBottom();
                this.chatMessageInput.nativeElement.focus();
            });
        } else {
            this.markAllUnreadMessagesOfUserAsRead(this.selectedUser);
            this.adjustChatScrollbarHeight();
            this.scrollToBottom();
            this.chatMessageInput.nativeElement.focus();
        }
    }

    adjustChatScrollbarHeight(): void {
        if (!this.selectedUser.friendUserId) {
            return;
        }

        let height =
            document.getElementById('kt_quick_sidebar').clientHeight -
            document.getElementById('kt_chat_content').getElementsByClassName('card-header')[0].clientHeight -
            document.getElementById('kt_chat_content').getElementsByClassName('card-footer')[0].clientHeight -
            100;

        this.chatScrollBar.directiveRef.elementRef.nativeElement.parentElement.style.height = height + 'px';
    }

    sendMessage(event?: any): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.chatMessage) {
            return;
        }

        this.sendingMessage = true;
        const tenancyName = this.appSession.tenant ? this.appSession.tenant.tenancyName : null;
        this._chatSignalrService.sendMessage({
            tenantId: this.selectedUser.friendTenantId,
            userId: this.selectedUser.friendUserId,
            message: this.chatMessage,
            tenancyName: tenancyName,
            userName: this.appSession.user.userName,
            profilePictureId: this.appSession.user.profilePictureId
        }, () => {
            this.chatMessage = '';
            this.sendingMessage = false;
        });
    }

    reversePinned(): void {
        this.pinned = !this.pinned;
    }

    quickSideBarBackClick(): void {
        this.selectedUser = new ChatFriendDto();
    }

    ngAfterViewInit(): void {
        this.mQuickSidebarOffcanvas = new KTOffcanvas('kt_quick_sidebar', {
            overlay: false,
            baseClass: 'offcanvas',
            placement: 'left',
            closeBy: 'kt_quick_sidebar_close',
            toggleBy: 'kt_quick_sidebar_toggle'
        });
        // new KTOffcanvas(this.el.nativeElement, {
        //     overlay: false,
        //     baseClass: 'offcanvas',
        //     placement: 'right',
        //     closeBy: 'kt_quick_sidebar_close',
        //     toggleBy: 'kt_quick_sidebar_toggle'
        // });

        this.mQuickSidebarOffcanvas.events.push({
            name: 'afterHide',
            handler: () => {
                this.isOpen = this._pinned;
            }
        }, {
            name: 'afterShow',
            handler: () => {
                this.isOpen = true;
            }
        });

        this.userLookupModal.configure({
            title: this.l('SelectAUser'),
            dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
                const input = new FindUsersInput();
                input.filter = filter;
                input.maxResultCount = maxResultCount;
                input.skipCount = skipCount;
                input.tenantId = tenantId;
                return this._commonLookupService.findUsers(input);
            }
        });
    }

    triggerUnreadMessageCountChangeEvent(): void {
        let totalUnreadMessageCount = 0;

        if (this.friends) {
            totalUnreadMessageCount = _.reduce(this.friends, (memo, friend) => memo + friend.unreadMessageCount, 0);
        }

        abp.event.trigger('app.chat.unreadMessageCountChanged', totalUnreadMessageCount);
    }

    registerEvents(): void {
        const self = this;

        function onMessageReceived(message) {
            const user = self.getFriendOrNull(message.targetUserId, message.targetTenantId);
            if (!user) {
                return;
            }

            user.messages = user.messages || [];
            user.messages.push(message);

            if (message.side === ChatSide.Receiver) {
                user.unreadMessageCount += 1;
                message.readState = ChatMessageReadState.Unread;
                self.triggerUnreadMessageCountChangeEvent();

                if (self.isOpen && self.selectedUser !== null && user.friendTenantId === self.selectedUser.friendTenantId && user.friendUserId === self.selectedUser.friendUserId) {
                    self.markAllUnreadMessagesOfUserAsRead(user);
                } else {
                    self.notify.info(
                        abp.utils.formatString('{0}: {1}', user.friendUserName, abp.utils.truncateString(message.message, 100)),
                        null,
                        {
                            onclick() {
                                if (document.body.className.indexOf('offcanvas-on') < 0) {
                                    self.showChatPanel();
                                    self.isOpen = true;
                                }

                                self.selectFriend(user);
                                self.pinned = true;
                            }
                        });
                }
            }

            self.scrollToBottom();
        }

        abp.event.on('app.chat.messageReceived', message => {
            self._zone.run(() => {
                onMessageReceived(message);
            });
        });

        function onFriendshipRequestReceived(data, isOwnRequest) {
            if (!isOwnRequest) {
                abp.notify.info(self.l('UserSendYouAFriendshipRequest', data.friendUserName));
            }

            if (!_.filter(self.friends, f => f.friendUserId === data.friendUserId && f.friendTenantId === data.friendTenantId).length) {
                self.friends.push(data);
            }
        }

        abp.event.on('app.chat.friendshipRequestReceived', (data, isOwnRequest) => {
            self._zone.run(() => {
                onFriendshipRequestReceived(data, isOwnRequest);
            });
        });

        function onUserConnectionStateChanged(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }

            user.isOnline = data.isConnected;
        }

        abp.event.on('app.chat.userConnectionStateChanged', data => {
            self._zone.run(() => {
                onUserConnectionStateChanged(data);
            });
        });

        function onUserStateChanged(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }

            user.state = data.state;
        }

        abp.event.on('app.chat.userStateChanged', data => {
            self._zone.run(() => {
                onUserStateChanged(data);
            });
        });

        function onAllUnreadMessagesOfUserRead(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }

            user.unreadMessageCount = 0;
            self.triggerUnreadMessageCountChangeEvent();
        }

        abp.event.on('app.chat.allUnreadMessagesOfUserRead', data => {
            self._zone.run(() => {
                onAllUnreadMessagesOfUserRead(data);
            });
        });

        function onReadStateChange(data) {
            const user = self.getFriendOrNull(data.friend.userId, data.friend.tenantId);
            if (!user) {
                return;
            }

            _.forEach(user.messages, message => {
                message.receiverReadState = ChatMessageReadState.Read;
            });
        }

        abp.event.on('app.chat.readStateChange', data => {
            self._zone.run(() => {
                onReadStateChange(data);
            });
        });

        function onConnected() {
            self.getFriendsAndSettings(() => {
                DomHelper.waitUntilElementIsReady('#kt_quick_sidebar', () => {
                    self.loadLastState();
                });
            });
        }

        abp.event.on('app.chat.connected', () => {
            self._zone.run(() => {
                onConnected();
            });
        });
    }

    showChatPanel(): void {
        document.body.className += ' offcanvas-on';
        document.getElementById('kt_quick_sidebar').className += ' offcanvas-on';
    }

    onWindowResize(event): void {
        this.adjustChatScrollbarHeight();
    }

    init(): void {
        this.registerEvents();
        this.getProfilePicture();

        this.tenantToTenantChatAllowed = this.feature.isEnabled('App.ChatFeature.TenantToTenant');
        this.tenantToHostChatAllowed = this.feature.isEnabled('App.ChatFeature.TenantToHost');
        this.interTenantChatAllowed = this.feature.isEnabled('App.ChatFeature.TenantToTenant') || this.feature.isEnabled('App.ChatFeature.TenantToHost') || !this.appSession.tenant;
    }
}
