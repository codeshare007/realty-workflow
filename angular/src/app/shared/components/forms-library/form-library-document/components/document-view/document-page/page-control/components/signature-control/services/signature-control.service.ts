import { Observable, Subject } from 'rxjs';

export class SignatureControlService {

    private _signatureState: boolean;
    private __signatureStateChange$: Subject<boolean> = new Subject<boolean>();

    get signatureState(): boolean {
        return this._signatureState;
    }

    set signatureState(value: boolean) {
        this._signatureState = value;
    }

    public getSignatureStateChange$(): Observable<boolean> {
        return this.__signatureStateChange$.asObservable();
    }

    public setSignatureStateChange(value: boolean): void {
        this.signatureState = value;
        this.__signatureStateChange$.next(value);
    }
}
