import { Pipe, PipeTransform } from '@angular/core';
import { SigningStatus } from '@shared/service-proxies/service-proxies';

@Pipe({ name: 'signingStatus' })
export class SigningStatusPipe implements PipeTransform {

    transform(value: number): string {
        if (value == undefined) { return '-'; }

        switch (value) {
            case SigningStatus.Wizard:
                return 'Wizard';
                case SigningStatus.Pending:
                    return 'Pending';
                    case SigningStatus.Completed:
                        return 'Completed';
                        case SigningStatus.Rejected:
                            return 'Rejected';
        }
    }
}
