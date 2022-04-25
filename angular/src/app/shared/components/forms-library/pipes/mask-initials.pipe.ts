import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskInitials',
    pure: true
})
export class MaskInitialsPipe implements PipeTransform {

    transform(value: string, isTwoSymbol: boolean): string {
        if (!value) { return ''; }

        if (!isTwoSymbol) { return value; }

        const solution = value.split('');
        if (value.length === 1) {
            return `${solution[0]}.`;
        } else {
            return `${value.split('.').join('').split('').join('.')}.`;
        }
    }
}
