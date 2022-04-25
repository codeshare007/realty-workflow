import { Pipe, PipeTransform } from '@angular/core';
import { FormEditDto } from '@shared/service-proxies/service-proxies';
import { PageLinesService } from '../services/page-lines.service';
import { ParticipantMargeService } from '../services/participant-marge.service';

@Pipe({
    name: 'pageLine'
})
export class PageLinePipe implements PipeTransform {

    constructor(
        private _pageLinesService: PageLinesService,
        private _participantMargeService: ParticipantMargeService,
    ) { }

    transform(forms: FormEditDto[]): FormEditDto[] {
        if (!forms) { return; }

        this._pageLinesService.setPageLines(forms);
        this._participantMargeService.setParticipantMargeForms(forms);

        return forms;
    }
}
