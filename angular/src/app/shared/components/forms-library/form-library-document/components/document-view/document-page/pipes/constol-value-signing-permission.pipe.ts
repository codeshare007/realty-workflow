import { Pipe, PipeTransform } from '@angular/core';
import { SignatureJsonValue } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlValueDto } from '@shared/service-proxies/service-proxies';

@Pipe({
    name: 'controlValueSigningPermission'
})
export class ControlValueSigningPermissionPipe implements PipeTransform {

    transform(value: ControlValueDto): string {
        if (!value || !value.value) { return ''; }

        let solution = '';
        const jsonObject: SignatureJsonValue = JSON.parse(value.value);
        if (jsonObject.accept) {
            solution = 'approved';
        } else if (jsonObject.decline) {
            solution = 'declined';
        }

        return solution;
    }
}
