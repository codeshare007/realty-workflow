import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NgxSpinnerTextService {
    private currentText = '';

    public getText(): string {
        return this.currentText;
    }

    public setText(text: string): void {
        this.currentText = text;
    }
}
