import { ControlType } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class PageControlService {
    private _isReloadControl: Subject<string> = new Subject<string>();
    private _isReloadMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public setReloadControl(value: string): void {
        this._isReloadControl.next(value);
    }

    public getReloadControl$(): Observable<string> {
        return this._isReloadControl.asObservable();
    }

    public setReloadMode(value: boolean): void {
        this._isReloadMode.next(value);
    }

    public getReloadMode$(): Observable<boolean> {
        return this._isReloadMode.asObservable();
    }

    public isCorrectPosition(left: number, top: number): boolean {
        if (left < 0 || top < 0) {
            return false;
        }
        return true;
    }

    public isSigningOptional(type: ControlType): boolean {
        return type === ControlType.OptionalInitials
            || type === ControlType.OptionalSigning;
    }

    public isInitials(type: ControlType): boolean {
        return type === ControlType.OptionalInitials
            || type === ControlType.Initials;
    }

    public isSigning(type: ControlType): boolean {
        return type === ControlType.OptionalInitials
            || type === ControlType.Initials
            || type === ControlType.Signature
            || type === ControlType.OptionalSigning;
    }
}
