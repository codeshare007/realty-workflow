import { Pipe, PipeTransform } from '@angular/core';
import { ControlType } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

@Pipe({
    name: 'formControlType'
})
export class FormControlTypePipe implements PipeTransform {
    transform(value: ControlType): string {
        if (!isNumber(value)) { return; }

        switch (value) {
            case ControlType.TextField:
                return 'Text Input';
            case ControlType.TextArea:
                return 'Text Area';
            case ControlType.DateTime:
                return 'Date';
            case ControlType.Signature:
                return 'Signature';
            case ControlType.Initials:
                return 'Initials';
        }
    }
}
