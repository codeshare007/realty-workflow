import { ControlEditDto, ControlLayer, TextPositionType } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { KEY_CODE } from '../models/table-documents.model';

export class MultiSelectControlsService {

    private _multiControls: ControlEditDto[] = [];
    private _isReloadMultiControl: Subject<boolean> = new Subject<boolean>();
    private _isDeleteMultiControl: Subject<ControlLayer> = new Subject<ControlLayer>();
    private _isCopyMultiControl: Subject<ControlLayer> = new Subject<ControlLayer>();

    public selectedControl: ControlEditDto;

    get multiControls(): ControlEditDto[] {
        return this._multiControls;
    }
    set multiControls(value: ControlEditDto[]) {
        this._multiControls = value;
    }

    public setReloadMultiControl(value: boolean): void {
        this._isReloadMultiControl.next(value);
    }

    public getReloadMultiControl$(): Observable<boolean> {
        return this._isReloadMultiControl.asObservable();
    }

    public setDeleteMultiControl(value: ControlLayer): void {
        this._isDeleteMultiControl.next(value);
    }

    public getDeleteMultiControl$(): Observable<ControlLayer> {
        return this._isDeleteMultiControl.asObservable();
    }

    public setCopyMultiControl(value: ControlLayer): void {
        this._isCopyMultiControl.next(value);
    }

    public getCopyMultiControl$(): Observable<ControlLayer> {
        return this._isCopyMultiControl.asObservable();
    }

    public editMultiControls(newControl: ControlEditDto, index: number): void {
        this.selectedControl = newControl;
        const findIndex = this.multiControls.findIndex((control) => {
            return control.id === newControl.id;
        });

        if (findIndex !== -1) {
            this.multiControls.splice(findIndex, 1);
        } else {
            this.multiControls.push(newControl);
        }
    }

    public isMultiSelected(checkControl: ControlEditDto): boolean {
        const find = this.multiControls.find((control) => {
            return control.id === checkControl.id;
        });

        return !isUndefined(find);
    }

    public removeSelection(newControl: ControlEditDto): void {
        const findIndex = this.multiControls.findIndex((control) => {
            return control.id === newControl.id;
        });

        if (findIndex !== -1) {
            this.multiControls.splice(findIndex, 1);
        }
    }

    public editControlParticipant(participantId: string): void {
        this.multiControls.map((control: ControlEditDto) => {
            return control.participantId = participantId;
        });
    }

    public editControlParticipantSetting(participantId: string): void {
        this.multiControls.map((control: ControlEditDto) => {
            return control.participantMappingItemId = participantId;
        });
    }

    public editControlSize(value: number, mainLayer: ControlLayer): void {
        this.multiControls.map((control) => {
            if (control.layer === mainLayer) {
                return control.font.sizeInPx = value;
            }
        });
    }

    public editControlTextPosition(value: TextPositionType, mainLayer: ControlLayer): void {
        this.multiControls.map((control) => {
            if (control.layer === mainLayer) {
                return control.textPosition = value;
            }
        });
    }

    public editControlPosition(key: KEY_CODE, mainLayer: ControlLayer): void {
        this.multiControls.map((control) => {
            if (control.layer === mainLayer) {
                switch (key) {
                    case KEY_CODE.UP_ARROW:
                        return control.position.top--;
                    case KEY_CODE.RIGHT_ARROW:
                        return control.position.left++;
                    case KEY_CODE.DOWN_ARROW:
                        return control.position.top++;
                    case KEY_CODE.LEFT_ARROW:
                        return control.position.left--;
                }
            }
        });
        this.setReloadMultiControl(true);
    }
}
