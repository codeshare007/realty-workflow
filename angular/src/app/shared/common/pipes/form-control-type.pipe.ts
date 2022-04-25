import { Pipe, PipeTransform } from '@angular/core';
import { ContactInfoDto, ContactListDto, ControlType } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';
import { SigningService } from 'signing/services/signing.service';

@Pipe({
    name: 'formControlType'
})
export class FormControlTypePipe implements PipeTransform {

    constructor(
        private _signingService: SigningService,
    ) { }

    transform(
        value: ControlType,
        isFormSetting = false,
        participants?: ContactListDto[],
        participantId?: string,
        isPublic?: boolean,
    ): string {
        if (!isNumber(value)) { return; }

        switch (value) {
            case ControlType.TextField:
                return 'Text Input';
            case ControlType.TextArea:
                return 'Text Area';
            case ControlType.DateTime:
                return 'Date';
            case ControlType.Signature:
            case ControlType.OptionalSigning:
                return this._findParticipantName(participants, participantId, isPublic, isFormSetting, value == ControlType.OptionalSigning);
            case ControlType.Initials:
            case ControlType.OptionalInitials:
                return this._findParticipantInitials(participants, participantId, isPublic, isFormSetting, value == ControlType.OptionalInitials);
            case ControlType.SigningDate:
                return 'Signing Date';
            case ControlType.Oval:
                return 'Oval';
            case ControlType.Square:
                return 'Square';
            case ControlType.DiagonalLine:
                return 'Diagonal Line';
            case ControlType.HorizontalLine:
                return 'Horizontal Line';
            case ControlType.VerticalLine:
                return 'Vertical Line';
            case ControlType.UploadAttachment:
                return 'Upload Attachment';
            case ControlType.Dropdown:
                return 'Dropdown';
            case ControlType.SignerName:
                if (participants && participants.length && participantId) {
                    const findParticipant: ContactListDto = participants.find((item) => {
                        return item.id === participantId;
                    });

                    return findParticipant
                        ? `${findParticipant.fullName}`
                        : 'Unassigned User';
                }

                return 'Signer Name';

        }
    }

    private _findParticipantName(
        participants: (ContactListDto | ContactInfoDto)[], participantId: string,
        isPublic: boolean, isFormSetting: boolean, isOptionnal: boolean
    ): string {
        const isParticipant: string = participants && participants.length && participantId;
        if (isParticipant) {
            const findParticipant: ContactListDto | ContactInfoDto = participants.find((item) => {
                return item.id === participantId;
            });

            if (participants[0] instanceof ContactListDto) {
                return findParticipant
                    ? `${(findParticipant as ContactListDto).fullName}`
                    : 'Unassigned User';
            } else if (participants[0] instanceof ContactInfoDto) {
                return findParticipant
                    ? `${(findParticipant as ContactInfoDto).signature}`
                    : 'Unassigned User';
            }
        }

        if (isPublic) {
            return this._signingService.participantName;
        }

        return isFormSetting ? 'Signature' + (isOptionnal ? ' Optional' : '') : 'Unassigned User';

    }

    private _findParticipantInitials(
        participants: (ContactListDto | ContactInfoDto)[], participantId: string,
        isPublic: boolean, isFormSetting: boolean, isOptionnal: boolean
    ): string {
        const isParticipant: string = participants && participants.length && participantId;
        if (isParticipant) {
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

        if (isPublic) {
            return this._signingService.participantInitials;
        } else {
            return isFormSetting ? 'Initials' + (isOptionnal ? ' Optional' : '') : 'S.S.';
        }
    }
}
