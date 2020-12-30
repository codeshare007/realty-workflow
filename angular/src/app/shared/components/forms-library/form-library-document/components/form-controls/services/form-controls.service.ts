import { ControlEditDto, ControlFontDto, ControlLayer, ControlPositionDto, ControlSizeDto, ControlType } from '@shared/service-proxies/service-proxies';


export class FormControlsService {

    controls: ControlEditDto[] = [
        this._setControls('Text input', ControlType.TextField),
        this._setControls('Text area', ControlType.TextArea),
        this._setControls('DateTime Picker', ControlType.DateTime),
        this._setControls('Initials', ControlType.Initials),
        this._setControls('Signature', ControlType.Signature),
    ];

    private _setControls(label: string, type: ControlType): ControlEditDto {
        const control = new ControlEditDto();
        control.type = type;
        control.layer = ControlLayer.Form;
        control.label = label;
        control.position = new ControlPositionDto();
        control.size = new ControlSizeDto();
        control.size.width = 140;
        control.size.height = 50;
        control.font = new ControlFontDto();
        control.font.sizeInPx = 14;

        return control;
    }

}
