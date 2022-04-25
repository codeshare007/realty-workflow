import { ISignatureInput } from '@app/shared/components/forms-library/models/table-documents.model';
import { Observable, Subject } from 'rxjs';

export class SignatureControlService {

    private _signatureState: ISignatureInput;
    private _signatureStateChange$: Subject<ISignatureInput> = new Subject<ISignatureInput>();
    private _uploadAttachmentChange$: Subject<ISignatureInput> = new Subject<ISignatureInput>();
    private _signingDateChange$: Subject<ISignatureInput> = new Subject<ISignatureInput>();
    private _colorPickerChange$: Subject<boolean> = new Subject<boolean>();

    get signatureState(): ISignatureInput {
        return this._signatureState;
    }

    set signatureState(value: ISignatureInput) {
        this._signatureState = value;
    }

    public getSigningDateChange$(): Observable<ISignatureInput> {
        return this._signingDateChange$.asObservable();
    }

    public setSigningDateChange(value: ISignatureInput): void {
        this._signingDateChange$.next(value);
    }

    public getSignatureStateChange$(): Observable<ISignatureInput> {
        return this._signatureStateChange$.asObservable();
    }

    public setSignatureStateChange(value: ISignatureInput): void {
        this.signatureState = value;
        this._signatureStateChange$.next(value);
    }

    public getUploadAttachmentChange$(): Observable<ISignatureInput> {
        return this._uploadAttachmentChange$.asObservable();
    }

    public setUploadAttachmentChange(value: ISignatureInput): void {
        this._uploadAttachmentChange$.next(value);
    }

    public getColorPickerChange$(): Observable<boolean> {
        return this._colorPickerChange$.asObservable();
    }

    public setColorPickerChange(value: boolean): void {
        this._colorPickerChange$.next(value);
    }
}
