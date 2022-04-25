import { ControlEditDto, ControlType } from '@shared/service-proxies/service-proxies';
import { get, isUndefined } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class ControlDetailsService {

    private _selectedControl: BehaviorSubject<ControlEditDto> = new BehaviorSubject<ControlEditDto>(null);
    private _isControlSelected: Subject<boolean> = new Subject<boolean>();

    control: ControlEditDto;

    public isTooltipeControl(type: ControlType): boolean {
        switch (type) {
            case ControlType.Initials:
            case ControlType.OptionalInitials:
            case ControlType.OptionalSigning:
            case ControlType.Signature:
            case ControlType.UploadAttachment:
                return true;
            default: return false;
        }
    }

    public isRequiredControl(type: ControlType): boolean {
        switch (type) {
            case ControlType.SignerName:
            case ControlType.SigningDate:
            case ControlType.Square:
            case ControlType.Oval:
            case ControlType.VerticalLine:
            case ControlType.HorizontalLine:
            case ControlType.DiagonalLine:
                return false;
            default: return true;
        }
    }

    public setIsControlSelected(value: boolean): void {
        this._isControlSelected.next(value);
    }

    public getIsControlSelected$(): Observable<boolean> {
        return this._isControlSelected.asObservable();
    }

    public setSelectControl(value: ControlEditDto): void {
        if (isUndefined(this.control) ||
            get(this.control, 'id') !== get(value, 'id')) {
            this.control = value;
            this._selectedControl.next(value);
        }
    }

    public getSelectControl$(): Observable<ControlEditDto> {
        return this._selectedControl.asObservable();
    }

    public selectControlDetails(control: ControlEditDto, isClear: boolean = false): void {
        if (isClear) {
            this.setIsControlSelected(false);
            this.setSelectControl(null);
            return;
        }

        this.setIsControlSelected(true);
        this.setSelectControl(control);
    }

}
