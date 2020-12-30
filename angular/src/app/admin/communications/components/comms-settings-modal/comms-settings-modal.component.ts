import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommunicationServiceProxy, CommunicationSettingsDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'comms-settings-modal',
    templateUrl: './comms-settings-modal.component.html',
})
export class CommsSettingsModalComponent extends AppComponentBase {

    @ViewChild('settingsModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    settings: CommunicationSettingsDto = new CommunicationSettingsDto();

    constructor(
        injector: Injector,
        private _communicationService: CommunicationServiceProxy,
    ) {
        super(injector);
    }

    show(): void {
        this._communicationService.getSettings().subscribe(result => {
            this.settings = result;
            this.active = true;
            this.modal.show();
        });
    }

    save(): void {
        this.saving = true;

        this._communicationService.updateSettings(this.settings)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.settings = new CommunicationSettingsDto();
        this.modal.hide();
    }
}
