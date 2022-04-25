import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PublishSigningInput, SigningParticipantCustomDataInput, SigningServiceProxy, SigningSignerDto, SigningSummaryDto, SigningViewerDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Participant, SubmitSigningModalBuffer } from '../services/submit-signing-modal-buffer.service';

@Component({
    selector: 'submit-signing-modal',
    templateUrl: './submit-signing-modal.component.html',
    providers: [SubmitSigningModalBuffer]
})
export class SubmitSigningModalComponent extends AppComponentBase {

    @ViewChild('submitModal', { static: true }) modal: ModalDirective;

    @Input() signingId: string;
    @Output() modalSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

    active = false;
    saving = false;
    signers: Participant[] = [];
    viewers: Participant[] = [];
    signingName: string;

    constructor(
        injector: Injector,
        private _signingService: SigningServiceProxy,
        private _submitSigningModalBuffer: SubmitSigningModalBuffer,
    ) {
        super(injector);
    }

    public show(name: string): void {
        this.signingName = name;
        this._signingService.getSummary(this.signingId)
            .subscribe((result: SigningSummaryDto) => {
                if (false) { }

                this.signers = result.participants.signers.map(this._mapInputToParticipant.bind(this));
                this.viewers = result.participants.viewers.map(this._mapInputToParticipant.bind(this));
                this._setBuffer();
                this.active = true;
                this.modal.show();
            });
    }

    public save(): void {
        const input = new PublishSigningInput();
        this._setBuffer();
        input.id = this.signingId;
        input.participantCustomData = [...this.signers, ...this.viewers].map(this._mapParticipantToOutput);
        this._signingService.publishSigning(input)
            .subscribe(() => {
                this.modalSubmit.emit();
                this.close();
            });
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public cancel() {
        this._submitSigningModalBuffer.isSaveBuffer = false;
        this.close();
    }

    public saveAndClose(): void {
        this._submitSigningModalBuffer.isSaveBuffer = true;
        this.close();
    }

    private _setBuffer(): void {
        this._submitSigningModalBuffer.signers = this.signers;
        this._submitSigningModalBuffer.viewers = this.viewers;
    }

    private _mapInputToParticipant(input: SigningSignerDto | SigningViewerDto): Participant {
        const participant = new Participant();
        participant.id = input.contact.id;
        participant.fullName = input.contact.fullName;
        participant.email = input.contact.email;
        participant.subject = this.signingName;
        participant.message = this._submitSigningModalBuffer.isSaveBuffer
            ? this._submitSigningModalBuffer.getMessage(input.contact.id) : '';

        if (input instanceof SigningSignerDto) {
            participant.controlsAmount = input.controlsAmount;
        }

        return participant;
    }

    private _mapParticipantToOutput(input: Participant) {
        const customData = new SigningParticipantCustomDataInput();
        customData.id = input.id;
        customData.emailAddress = input.email;
        customData.subject = input.subject;
        customData.message = input.message;

        return customData;
    }
}
