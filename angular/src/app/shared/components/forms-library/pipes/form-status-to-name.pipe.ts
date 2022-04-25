import { Pipe, PipeTransform } from '@angular/core';
import { FormStatus } from '@shared/service-proxies/service-proxies';
import { FormStatusToNameService } from '../services/form-status-to-name.service';

@Pipe({
    name: 'formStatus'
})
export class FormStatusToNamePipe implements PipeTransform {

    constructor(
        private _formStatusToNameService: FormStatusToNameService
    ) { }

    transform(status: FormStatus): string {
        return this._formStatusToNameService.getName(status);
    }
}
