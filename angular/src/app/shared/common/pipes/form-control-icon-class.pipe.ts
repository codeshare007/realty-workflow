import { Pipe, PipeTransform } from '@angular/core';
import { ControlType } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

@Pipe({
    name: 'formControlIconClass'
})
export class FormControlIconClassPipe implements PipeTransform {
    transform(value: ControlType): string {
        if (!isNumber(value)) { return; }

        switch (value) {
            case ControlType.TextField:
                return 'fas fa-font';
            case ControlType.TextArea:
                return 'fas fa-heading';
            case ControlType.DateTime:
                return 'far fa-calendar';
            case ControlType.Signature:
            case ControlType.Initials:
                return 'fas fa-signature';
            case ControlType.SigningDate:
                return 'far fa-calendar-check';
            case ControlType.Oval:
                return 'far fa-circle';
            case ControlType.Square:
                return 'far fa-square';
            case ControlType.DiagonalLine:
                return 'line-svg__diagonal';
            case ControlType.HorizontalLine:
                return 'line-svg__horizontal';
            case ControlType.VerticalLine:
                return 'line-svg__vertical';
            case ControlType.Dropdown:
                return 'far fa-list-alt';
            case ControlType.SignerName:
                return 'far fa-user';
            case ControlType.OptionalInitials:
            case ControlType.OptionalSigning:
                return 'fas fa-file-signature';
            case ControlType.UploadAttachment:
                return 'fas fa-paperclip';
        }
    }
}
