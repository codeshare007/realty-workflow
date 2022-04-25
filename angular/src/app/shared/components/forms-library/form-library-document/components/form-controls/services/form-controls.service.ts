import { Injectable } from '@angular/core';
import { IControlParticipant } from '@app/shared/components/forms-library/models/table-documents.model';
import { DocumentControlHealperService } from '@app/shared/components/forms-library/services/document-controller-helper.service';
import { ContactListDto, ControlEditDto, ControlFontDto, ControlPositionDto, ControlSizeDto, ControlType, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class FormControlsService {

    controls: ControlEditDto[] = [
        this._setControls('Text input', ControlType.TextField),
        this._setControls('Text area', ControlType.TextArea),
        this._setControls('DateTime Picker', ControlType.DateTime),
        this._setControls('Initials', ControlType.Initials),
        this._setControls('Signature', ControlType.Signature),
        this._setControls('Signing Date', ControlType.SigningDate),
        this._setControls('Dropdown', ControlType.Dropdown),
        this._setControls('SignerName', ControlType.SignerName),
        this._setControls('OptionalInitials', ControlType.OptionalInitials),
        this._setControls('OptionalSigning', ControlType.OptionalSigning),
        this._setControls('Upload Attachment', ControlType.UploadAttachment),
    ];

    controlsMoqups: ControlEditDto[] = [
        this._setControls('Oval', ControlType.Oval),
        this._setControls('Square', ControlType.Square),
        this._setControls('Diagonal Line', ControlType.DiagonalLine),
        this._setControls('Horizontal Line', ControlType.HorizontalLine),
        this._setControls('Vertical Line', ControlType.VerticalLine),
    ];

    controlParticipants: IControlParticipant[] = [];
    controlParticipantsSetting: IControlParticipant[] = [];

    constructor(
        private _controlHealper: DocumentControlHealperService,
    ) { }

    public setParticipentToControl(participantId: string): void {
        this.controls.map((item) => {
            item.participantId = participantId;
        });
    }

    public setParticipentSettingToControl(participantId: string): void {
        this.controls.map((item: ControlEditDto) => {
            item.participantMappingItemId = participantId;
        });
    }

    public setControlParticipants(participants: ContactListDto[]): void {
        this.controlParticipants = [];

        participants.forEach((element, index) => {
            this.controlParticipants.push(new IControlParticipant(
                element.id, (index + 1)
            ));
        });
    }

    public setControlParticipantsSetting(participants: ParticipantMappingItemDto[]): void {
        this.controlParticipantsSetting = [];

        participants.forEach((element, index) => {
            this.controlParticipantsSetting.push(new IControlParticipant(
                element.id, (index + 1)
            ));
        });
    }

    private _setControls(label: string, type: ControlType): ControlEditDto {
        const control = new ControlEditDto();
        control.type = type;
        control.label = label;
        control.position = new ControlPositionDto();
        control.size = new ControlSizeDto();
        control.size.width = type === ControlType.Initials
            || type === ControlType.UploadAttachment ? 50
            : type === ControlType.OptionalInitials ? 60 : 140;
        control.size.height = (type === ControlType.OptionalInitials
            || type === ControlType.OptionalSigning) ? 60 : 50;
        control.font = new ControlFontDto();
        control.font.sizeInPx = 14;
        control.participantId = undefined;
        control.participantMappingItemId = undefined;
        control.isProtected = false;
        control.isRequired = (this._controlHealper.isMoqups(type)
            || ControlType.SigningDate === type
            || ControlType.Dropdown === type
            || ControlType.SignerName === type) ? false : true;

        return control;
    }
}
