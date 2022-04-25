import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';

@Injectable({ providedIn: 'root' })
export class SigningSignatureService {

    private _signature: string;

    get signature(): string {
        return this._signature;
    }

    set signature(value: string) {
        this._signature = value;
    }

    public isSignatureInited(): boolean {
        return !isEmpty(this.signature);
    }
}
