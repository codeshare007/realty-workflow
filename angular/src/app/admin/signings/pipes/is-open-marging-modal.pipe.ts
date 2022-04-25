import { Pipe, PipeTransform } from '@angular/core';
import { ControlEditDto, FormEditDto, PageEditDto } from '@shared/service-proxies/service-proxies';

@Pipe({
    name: 'isOpenMargingModal'
})
export class IsOpenMargingModalPipe implements PipeTransform {

    transform(forms: FormEditDto[]): boolean {
        if (!forms) { return; }

        let solution = true;
        forms.forEach((form: FormEditDto) => {
            form.pages.forEach((page: PageEditDto) => {
                page.controls.forEach((control: ControlEditDto) => {
                    if (control.participantMappingItemId && control.participantId) {
                        solution = false;
                    }
                });
            });
        });

        return solution;
    }
}
