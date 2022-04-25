import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';

@Injectable({ providedIn: 'root' })
export class SigningInitialService {

    private _initial: string;

    get initial(): string {
        return this._initial;
    }

    set initial(value: string) {
        this._initial = value;
    }

    public isInitialInited(): boolean {
        return !isEmpty(this._initial);
    }
}
