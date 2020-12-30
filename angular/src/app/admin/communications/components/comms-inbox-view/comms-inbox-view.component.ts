import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommunicationServiceProxy, GetCommunicationTopicDetailsOutput } from '@shared/service-proxies/service-proxies';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'comms-inbox-view',
  templateUrl: './comms-inbox-view.component.html',
  styleUrls: ['./comms-inbox-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommsInboxViewComponent implements OnChanges {

  loading = false;

  @Input() contact: string;
  topic: GetCommunicationTopicDetailsOutput;

  constructor(
    private _communicationService: CommunicationServiceProxy,
    private _cdr: ChangeDetectorRef,
    private _localStorageService: LocalStorageService,
  ) {
  }

  ngOnChanges({ contact }: SimpleChanges): void {
    if (contact && contact.currentValue !== contact.previousValue) {
      this.getItems();
    }
  }

  getItems() {
    if (!this.contact) {
      this.topic = undefined;
    }

    this.loading = true;

    this._communicationService
      .getCommunicationTopicDetails(this.contact)
      .pipe(finalize(() => {
        this.loading = false;
        this._cdr.markForCheck();
      }))
      .subscribe(result => this.topic = result);
  }
}
