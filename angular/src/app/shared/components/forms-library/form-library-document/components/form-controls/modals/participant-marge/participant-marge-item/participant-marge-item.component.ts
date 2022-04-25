import { Component, Input } from '@angular/core';
import { ParticipantMargeControlsGroup } from '@app/shared/components/forms-library/models/table-documents.model';
import { ContactListDto, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';
import { isNull } from 'lodash';
import { ParticipantClassPipe } from '../../../../document-view/document-page/pipes/participant-class.pipe';
import { FormControlsService } from '../../../services/form-controls.service';

@Component({
    selector: 'participant-marge-item',
    templateUrl: './participant-marge-item.component.html',
    providers: [ParticipantClassPipe]
})
export class ParticipantMargeItemComponent {

    @Input() participants: ContactListDto[];
    @Input() participant: ParticipantMappingItemDto;
    @Input() control: ParticipantMargeControlsGroup;
    @Input() participantMappingItems: ParticipantMappingItemDto[];
    @Input() index: number;

    selectParticipant: ContactListDto = new ContactListDto();

    constructor(
        private _formControlsService: FormControlsService,
        private _participantClassPipe: ParticipantClassPipe,
    ) { }

    public onParticipantSelect(event: ContactListDto): void {
        if (!isNull(event)) {
            this.selectParticipant = event;
            this.control.controls.forEach((control) => {
                control.parcipantId = this.selectParticipant.id;
            });
        } else {
            this.control.controls.forEach((control) => {
                control.parcipantId = null;
            });
        }
    }

    public getParticipantName(): string {
        if (this.control && this.participantMappingItems.length) {
            const find = this.participantMappingItems
                .find((item: ParticipantMappingItemDto) => {
                    return item.id === this.control.parcipantMargeId;
                });

            return find ? find.name : '';
        } else {
            return '';
        }
    }

    public getParticipantClass(participant: ContactListDto): string {
        if (!participant) { return; }

        return this._participantClassPipe.transform(
            participant.id, this._formControlsService.controlParticipants
        );
    }
}
