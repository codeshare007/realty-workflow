import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommunicationSendMessageInput, CommunicationServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'comms-compose-message',
  templateUrl: './comms-compose-message.component.html',
  styleUrls: ['./comms-compose-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommsComposeMessageComponent extends AppComponentBase {

  saving = false;

  @Input() contact: string;
  @Output() messageSent = new EventEmitter<void>();

  input = new CommunicationSendMessageInput();

  constructor(
    injector: Injector,
    private _communicationService: CommunicationServiceProxy,
    private _cdr: ChangeDetectorRef,
  ) {
    super(injector);
  }

  sendMessage() {
    this.saving = true;
    this.input.contact = this.contact;

    this._communicationService.sendMessage(this.input)
      .pipe(finalize(() => {
        this.saving = false;
        this._cdr.markForCheck();
      }))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.input = new CommunicationSendMessageInput();
        this.messageSent.emit();
      });
  }
}
