import { ViewMode } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class FormLibraryDocumentService {

    private _layer: ControlLayer = ControlLayer.Form;
    private _layerChange$: BehaviorSubject<ControlLayer> = new BehaviorSubject<ControlLayer>(this.layer);
    private _mode: ViewMode;
    private _modeChange$: Subject<ViewMode> = new Subject<ViewMode>();

    get layer(): ControlLayer {
        return this._layer;
    }

    set layer(value: ControlLayer) {
        this._layer = value;
    }

    get mode(): ViewMode {
        return this._mode;
    }

    set mode(value: ViewMode) {
        this._mode = value;
    }

    public getModeChange$(): Observable<ViewMode> {
        return this._modeChange$.asObservable();
    }

    public setModeChange(mode: ViewMode): void {
        this.mode = mode;
        this._modeChange$.next(mode);
    }

    public getLayerChange$(): Observable<ControlLayer> {
        return this._layerChange$.asObservable();
    }

    public setLayerChange(layer: ControlLayer): void {
        this.layer = layer;
        this._layerChange$.next(layer);
    }
}
