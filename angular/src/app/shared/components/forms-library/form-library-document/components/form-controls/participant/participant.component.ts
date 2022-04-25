import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto } from '@shared/service-proxies/service-proxies';
import { ParticipantClassPipe } from '../../document-view/document-page/pipes/participant-class.pipe';
import { FormControlsService } from '../services/form-controls.service';


@Component({
    selector: 'participant',
    templateUrl: './participant.component.html',
    providers: [ParticipantClassPipe]
})
export class ParticipantComponent extends AppComponentBase implements OnChanges {

    @Input() participants: ContactListDto[];
    @Input() title: string;
    @Input() participantId: string;
    @Input() isLabel = true;
    @Input() isReload: boolean;
    @Input() isDefault = true;

    @Output() selectedParticipant: EventEmitter<ContactListDto> = new EventEmitter<ContactListDto>();

    showDropDown = false;
    participantActionValue = 'Unassigned';
    selectParticipant: ContactListDto;

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _formControlsService: FormControlsService,
        private _participantClassPipe: ParticipantClassPipe,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.participants
            && this._isValueChanges(changes)
        ) {
            this._selectedParticipant();
        } else if (changes.isReload) {
            this._selectedParticipant();
        }
    }

    public getParticipantClass(participant: ContactListDto): string {
        if (!participant) { return; }

        return this._participantClassPipe
            .transform(participant.id, this._formControlsService.controlParticipants);
    }

    public selectValue(value: ContactListDto) {
        if (!value) { return; }

        this.selectParticipant = value;
        this.participantActionValue = value.fullName;
        this.showDropDown = false;
        if (value.id !== 'default') {
            this.selectedParticipant.emit(this.selectParticipant);
        } else {
            this.selectedParticipant.emit(null);
        }
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    private _isValueChanges(changes: SimpleChanges): boolean {
        const currentParticipants = changes.participants.currentValue ? changes.participants.currentValue : [];
        const previousValueParticipants = changes.participants.previousValue ? changes.participants.previousValue : [];

        return currentParticipants.length !== previousValueParticipants.length;
    }

    private _selectedParticipant(): void {
        const findDefault = this.isDefault ? this.participants.find((item) => {
            return item.id === (this.participantId ? this.participantId : 'default');
        }) : this.participants[0];
        this.selectParticipant = findDefault;
        this.participantActionValue = this.selectParticipant
            ? (this.selectParticipant.id === 'default'
                ? this.selectParticipant.firstName
                : this.selectParticipant.fullName)
            : '';
        if (!this.isDefault) {
            this.selectedParticipant.emit(findDefault);
        }
    }
}
