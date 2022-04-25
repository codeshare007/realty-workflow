import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SigningFormDesignReloadService {

    private _isReloadBackground: Subject<boolean> = new Subject<boolean>();

    public setReloadBackground(value: boolean): void {
        this._isReloadBackground.next(value);
    }

    public getReloadBackground$(): Observable<boolean> {
        return this._isReloadBackground.asObservable();
    }
}
