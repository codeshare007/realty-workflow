import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'controlValueSigningText'
})
export class ControlValueSigningTextPipe implements PipeTransform {

    transform(value: string): string {
        if (!value) { return ''; }

        const solution = JSON.parse(value).data;

        return solution;
    }
}
