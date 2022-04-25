import { Pipe, PipeTransform } from '@angular/core';
import { ParticipantMappingItemsInput } from '@shared/service-proxies/service-proxies';
import { uniqBy } from 'lodash';

@Pipe({
    name: 'participantsFilterDefault'
})
export class ParticipantsFilterDefaultPipe implements PipeTransform {
    transform(participants: ParticipantMappingItemsInput[]): ParticipantMappingItemsInput[] {
        if (participants && !participants.length) { return; }

        return uniqBy(participants, 'id');
    }
}
