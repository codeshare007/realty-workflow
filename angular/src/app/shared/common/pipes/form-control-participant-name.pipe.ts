import { Pipe, PipeTransform } from '@angular/core';
import { ContactInfoDto, ContactListDto, ControlType } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

@Pipe({
    name: 'formControlParticipantName'
})
export class FormControlParticipantNamePipe implements PipeTransform {

    transform(
        value: ControlType,
        participants?: ContactListDto[],
        participantId?: string,
    ): string {
        if (!isNumber(value)) { return; }

        return this._getParticipantName(value, participants, participantId);
    }

    private _getParticipantName(
        value: ControlType, participants: (ContactListDto | ContactInfoDto)[], participantId: string
    ): string {
        switch (value) {
            case ControlType.TextField:
            case ControlType.TextArea:
            case ControlType.DateTime:
            case ControlType.SigningDate:
            case ControlType.Dropdown:
            case ControlType.SignerName:
            case ControlType.OptionalInitials:
            case ControlType.OptionalSigning:
            case ControlType.Signature:
                return this._findParticipantName(participants, participantId);
            case ControlType.DiagonalLine:
            case ControlType.Oval:
            case ControlType.Square:
            case ControlType.HorizontalLine:
            case ControlType.UploadAttachment:
            case ControlType.VerticalLine:
                return '';
            case ControlType.Initials:
                return this._findParticipantInitials(participants, participantId);
        }
    }

    private _findParticipantName(participants: (ContactListDto | ContactInfoDto)[], participantId: string): string {
        const isParticipant: string = participants && participants.length && participantId;
        if (!isParticipant) { return ''; }

        const findParticipant: ContactListDto | ContactInfoDto = participants.find((item) => {
            return item.id === participantId;
        });

        if (participants[0] instanceof ContactListDto) {
            return findParticipant
                ? `${(findParticipant as ContactListDto).fullName
                }`
                : 'Unassigned User';
        } else if (participants[0] instanceof ContactInfoDto) {
            return findParticipant
                ? `${(findParticipant as ContactInfoDto).signature}`
                : 'Unassigned User';
        }
    }

    private _findParticipantInitials(participants: (ContactListDto | ContactInfoDto)[], participantId: string): string {
        const isParticipant: string = participants && participants.length && participantId;
        if (!isParticipant) { return ''; }

        const findParticipant: ContactListDto | ContactInfoDto = participants.find((item) => {
            return item.id === participantId;
        });

        if (participants[0] instanceof ContactListDto) {
            return findParticipant
                ? `${(findParticipant as ContactListDto).firstName[0]}.${(findParticipant as ContactListDto).lastName[0]}.`
                : 'S.S.';
        } else if (participants[0] instanceof ContactInfoDto) {
            return findParticipant
                ? `${(findParticipant as ContactInfoDto).initials}`
                : 'S.S.';
        }
    }
}
