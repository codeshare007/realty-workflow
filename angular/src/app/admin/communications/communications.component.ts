import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommunicationServiceProxy, CommunicationTopicListDto } from '@shared/service-proxies/service-proxies';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { finalize } from 'rxjs/operators';
import { CommsSettingsModalComponent } from './components/comms-settings-modal/comms-settings-modal.component';

@Component({
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.less'],
    animations: [appModuleAnimation()],
})
export class CommunicationsComponent extends AppComponentBase implements OnInit {

    @ViewChild(CommsSettingsModalComponent, { static: true }) settingsModal: CommsSettingsModalComponent;

    loading = false;
    items: CommunicationTopicListDto[] = [];
    isInitModalShown = false;

    selectedTopic: CommunicationTopicListDto;

    constructor(
        injector: Injector,
        private _communicationService: CommunicationServiceProxy,
        private _localStorageService: LocalStorageService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getItems();
    }

    topicSelected(item: CommunicationTopicListDto) {
        this.selectedTopic = item;
    }

    setUsersProfilePictureUrl(items: CommunicationTopicListDto[]): void {
        const defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.userId) {
                (item as any).profilePictureUrl = defaultProfilePicture;
                continue;
            }

            this._localStorageService.getItem(
                AppConsts.authorization.encrptedAuthTokenName,
                function (err, value) {
                    (item as any).profilePictureUrl = `${AppConsts.remoteServiceBaseUrl}/Profile/GetProfilePictureByUser?userId=${item.userId}&${AppConsts.authorization.encrptedAuthTokenName}=${encodeURIComponent(value.token)}`;
                }
            );
        }
    }

    getItems() {
        this.loading = true;

        this._communicationService.getCommunicationTopics()
            .pipe(finalize(() => this.loading = false))
            .subscribe(result => {
                this.items = result.items;
                this.setUsersProfilePictureUrl(result.items);

                if (!result.isInitialized && !this.isInitModalShown) {
                    this.settingsModal.show();
                    this.isInitModalShown = true;
                }
            });
    }
}
