import { Pipe, PipeTransform } from '@angular/core';
import { ControlValueDto } from '@shared/service-proxies/service-proxies';

@Pipe({
    name: 'controlValueText'
})
export class ControlValueTextPipe implements PipeTransform {

    transform(controlValue: ControlValueDto): string {
        if (!controlValue) { return ''; }
        let solution = '';
        if (controlValue.value) {

            const saveNewLine = controlValue.value.replace(/\r/g, '').replace(/\n/g, '<br>');
            solution = saveNewLine.replace(/\s/g, '&nbsp;');
        }

        return solution;
    }
}
