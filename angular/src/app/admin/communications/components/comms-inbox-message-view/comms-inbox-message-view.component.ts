import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { CommunicationItemDto } from '@shared/service-proxies/service-proxies';
import { LocalStorageService } from '@shared/utils/local-storage.service';

const defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

@Component({
  selector: 'comms-inbox-message-view',
  templateUrl: './comms-inbox-message-view.component.html',
  styleUrls: ['./comms-inbox-message-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommsInboxMessageViewComponent implements OnChanges {

  @Input() item: CommunicationItemDto;
  profilePictureUrl: string;

  get shortMessage() {
    if (!this.item.message) {
      return '';
    }

    const trimmedEOL = this.item.message.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
    return trimmedEOL.length > 93
      ? trimmedEOL.substring(0, 90) + '...'
      : trimmedEOL;
  }

  get receivedOn() {
    return this.item.receivedOnUtc.local();
  }

  isToggled = false;

  constructor(
    private _localStorageService: LocalStorageService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges({ item }: SimpleChanges): void {
    if (item && item.currentValue !== item.previousValue) {
      this.profilePictureUrl = undefined;

      const userId = this.item.userId;

      if (!userId) {
        this.profilePictureUrl = defaultProfilePicture;
        return;
      } else {
        const self = this;

        this._localStorageService.getItem(
          AppConsts.authorization.encrptedAuthTokenName,
          function (_err, value) {
            self.profilePictureUrl = `${AppConsts.remoteServiceBaseUrl}/Profile/GetProfilePictureByUser?userId=${userId}&${AppConsts.authorization.encrptedAuthTokenName}=${encodeURIComponent(value.token)}`;
            self._cdr.markForCheck();
          }
        );
      }
    }
  }

  toggleDisplay() {
    this.isToggled = !this.isToggled;
  }

}
