import { Injectable } from '@angular/core';
import { ControlEditDto, ControlType } from '@shared/service-proxies/service-proxies';

@Injectable({ providedIn: 'root' })
export class PageControlHealperService {

    public getFontSize(control: ControlEditDto): number {
        return control.type === ControlType.Initials
            || control.type === ControlType.OptionalInitials
            ? Math.floor((control.size.height / 2) - 8)
            : control.font.sizeInPx;
    }
}
