import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class UpdateFormListenerService {

    private _debounceCheckUpdate: Subject<boolean> = new Subject<boolean>();
    public isLoading = false;

    public setDebounceCheckUpdate(value: boolean): void {
        this._debounceCheckUpdate.next(value);
    }

    public getDebounceCheckUpdate$(): Observable<boolean> {
        return this._debounceCheckUpdate.asObservable()
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
            );
    }

}
