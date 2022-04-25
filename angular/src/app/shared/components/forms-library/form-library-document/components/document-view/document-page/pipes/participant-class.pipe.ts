import { Pipe, PipeTransform } from '@angular/core';
import { IControlParticipant } from '@app/shared/components/forms-library/models/table-documents.model';

@Pipe({
    name: 'getParticipantClass'
})
export class ParticipantClassPipe implements PipeTransform {

    transform(participantId: string, controls: IControlParticipant[]): string {
        if (!participantId || participantId.includes('default')) { return 'participant__default'; }

        const find = controls
            .find((item) => {
                return item.participantId === participantId;
            });

        const order = find ? find.order : null;

        return 'participant__' + this._getClassName(order);
    }

    private _getClassName(order: number): string {
        switch (order) {
            case 1:
                return 'first';
            case 2:
                return 'second';
            case 3:
                return 'third';
            case 4:
                return 'fourth';
            case 5:
                return 'fifth';
            case 6:
                return 'sixth';
            case 7:
                return 'seventh';
            case 8:
                return 'eighth';
            case 9:
                return 'ninth';
            case 10:
                return 'tenth';
            case 11:
                return 'eleventh';
            case 12:
                return 'twelfth';
            default:
                return 'default';
        }
    }
}
