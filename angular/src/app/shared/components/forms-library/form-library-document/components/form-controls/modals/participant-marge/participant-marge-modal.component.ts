import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { ParticipantMargeForm } from '@app/shared/components/forms-library/models/table-documents.model';
import { ParticipantMargeService } from '@app/shared/components/forms-library/services/participant-marge.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    selector: 'participant-marge-modal',
    templateUrl: './participant-marge-modal.component.html',
})
export class ParticipantMargeModalComponent extends AppComponentBase implements OnChanges {

    @HostBinding('class.participant-marge-modal') class = true;

    @ViewChild('participantMargeModal') modal: ModalDirective;

    @Input() participants: ContactListDto[];

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    get participantMargeForms(): ParticipantMargeForm[] {
        return this._participantMargeService.participantMargeForms
            .filter((item) => {
                return item.controls.length;
            });
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _participantMargeService: ParticipantMargeService,
        private _formLibraryReloadService: FormLibraryReloadService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    public show(): void {
        this.active = true;
        this.modal.show();
    }

    public onShown(): void {
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        this.modalSave.emit();
        this._participantMargeService.mapSigningForm();
        this._formLibraryReloadService.setLoadingChange(true);
        this.close();
    }
}
