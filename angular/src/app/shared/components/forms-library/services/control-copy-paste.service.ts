import { Injectable } from '@angular/core';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { Observable, Subject } from 'rxjs';
import { ICopyPastControl } from '../models/table-documents.model';

@Injectable()
export class ControlCopyPasteService {

    private _multiControls: ControlEditDto[] = [];
    public selectedControl: ICopyPastControl;
    public copiedControl = false;
    private _isCopyPasteControl: Subject<boolean> = new Subject<boolean>();

    get multiControls(): ControlEditDto[] {
        return this._multiControls;
    }
    set multiControls(value: ControlEditDto[]) {
        this._multiControls = value;
    }

    constructor(
    ) { }

    public setCopyPasteControl(value: boolean): void {
        this._isCopyPasteControl.next(value);
    }

    public getCopyPasteControl$(): Observable<boolean> {
        return this._isCopyPasteControl.asObservable();
    }

    public reset(): void {
        this.copiedControl = false;
        this.multiControls = [];
        this.selectedControl = undefined;
    }
}
