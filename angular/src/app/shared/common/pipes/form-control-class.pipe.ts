import { Pipe, PipeTransform } from '@angular/core';
import { ControlType } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

@Pipe({
    name: 'formControlClass'
})
export class FormControlClassPipe implements PipeTransform {
    transform(value: ControlType): string {
        if (!isNumber(value)) { return; }

        switch (value) {
            case ControlType.TextField:
                return 'control-input';
            case ControlType.TextArea:
                return 'control-area';
            case ControlType.DateTime:
                return 'control-date';
            case ControlType.Signature:
                return 'control-signature';
            case ControlType.Initials:
                return 'control-initials';
            case ControlType.SigningDate:
                return 'control-signing-date';
            case ControlType.Oval:
                return 'control-oval';
            case ControlType.Square:
                return 'control-square';
            case ControlType.DiagonalLine:
                return 'control-diagonal-line';
            case ControlType.HorizontalLine:
                return 'control-horizontal-line';
            case ControlType.VerticalLine:
                return 'control-vertical-line';
            case ControlType.Dropdown:
                return 'control-dropdown';
            case ControlType.SignerName:
                return 'control-signer-name';
            case ControlType.OptionalInitials:
                return 'control-optional-initials';
            case ControlType.OptionalSigning:
                return 'control-optional-signing';
            case ControlType.UploadAttachment:
                return 'control-upload-attachment';
        }
    }
}
