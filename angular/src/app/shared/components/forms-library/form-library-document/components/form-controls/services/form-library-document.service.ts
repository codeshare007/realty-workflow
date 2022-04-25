import { MultiplSelectedMode } from '@app/shared/components/forms-library/models/table-documents.model';
import { Observable, Subject } from 'rxjs';

export class FormLibraryDocumentService {

    private _mode: MultiplSelectedMode;
    private _modeChange$: Subject<MultiplSelectedMode> = new Subject<MultiplSelectedMode>();

    get mode(): MultiplSelectedMode {
        return this._mode;
    }

    set mode(value: MultiplSelectedMode) {
        this._mode = value;
    }

    public getModeChange$(): Observable<MultiplSelectedMode> {
        return this._modeChange$.asObservable();
    }

    public setModeChange(mode: MultiplSelectedMode): void {
        this.mode = mode;
        this._modeChange$.next(mode);
    }
}
