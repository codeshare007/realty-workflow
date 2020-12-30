import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormLibraryReloadService {
    private _isLoading: boolean;
    private _isLoadingChange$: Subject<boolean> = new Subject<boolean>();

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        this._isLoading = value;
    }

    public getLoadingChange$(): Observable<boolean> {
        return this._isLoadingChange$.asObservable();
    }

    public setLoadingChange(isLoading: boolean): void {
        this.isLoading = isLoading;
        this._isLoadingChange$.next(isLoading);
    }
}
