import { MultipleCopyControl } from '@app/shared/components/forms-library/models/table-documents.model';
import { Observable, Subject } from 'rxjs';

export class SigningFormDesignPage {
    private _isCopyControls: Subject<MultipleCopyControl> = new Subject<MultipleCopyControl>();
    private _isCopyMultipleControls: Subject<MultipleCopyControl> = new Subject<MultipleCopyControl>();
    private _isReloadCopyControl: Subject<boolean> = new Subject<boolean>();

    public setReloadCopyControl(value: boolean): void {
        this._isReloadCopyControl.next(value);
    }

    public getReloadCopyControl$(): Observable<boolean> {
        return this._isReloadCopyControl.asObservable();
    }

    public setCopyControls(value: MultipleCopyControl): void {
        this._isCopyControls.next(value);
    }

    public getCopyControls$(): Observable<MultipleCopyControl> {
        return this._isCopyControls.asObservable();
    }

    public setCopyMultipleControls(value: MultipleCopyControl): void {
        this._isCopyMultipleControls.next(value);
    }

    public getCopyMultipleControls$(): Observable<MultipleCopyControl> {
        return this._isCopyMultipleControls.asObservable();
    }
}
