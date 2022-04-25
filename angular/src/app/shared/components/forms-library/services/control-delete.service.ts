import { Observable, Subject } from 'rxjs';

export class ControlDeleteService {

    private _isCtrlDeleteControl: Subject<boolean> = new Subject<boolean>();

    public setCtrlDeleteControl(value: boolean): void {
        this._isCtrlDeleteControl.next(value);
    }

    public getCtrlDeleteControl$(): Observable<boolean> {
        return this._isCtrlDeleteControl.asObservable();
    }
}
