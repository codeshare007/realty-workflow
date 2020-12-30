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
        }
    }
}
