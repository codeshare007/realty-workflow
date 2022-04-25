import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnInit } from '@angular/core';
import { DocumentControlHealperService } from '@app/shared/components/forms-library/services/document-controller-helper.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlType } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'moqup-control',
    templateUrl: './moqup-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoqupControlComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.moqup-control') class = true;

    @Input() control: ControlEditDto;
    @Input() rgbaColor: string;
    @Input() height = 0;
    @Input() width = 0;
    // @Input() widthTop = 0;
    // @Input() heightTop = 0;

    get styleControlOval(): Object {
        return {
            'background-color': this._setBackgroundColorOval(),
        };
    }
    get controlType() {
        return ControlType;
    }
    get isMoqups(): boolean {
        return this._controlHealper.isMoqups(this.control.type);
    }
    get isMoqupLine(): boolean {
        return this._controlHealper.isMoqupLine(this.control.type);
    }
    get styleControl(): Object {
        return {
            'background-color': this._setBackgroundColorSquare(),
        };
    }

    constructor(
        injector: Injector,
        private _controlHealper: DocumentControlHealperService,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    private _setBackgroundColorOval(): string {
        if (this._isColorPicker() && ControlType.Oval === this.control.type) {
            return this.rgbaColor ? this.rgbaColor : '';
        } else { return ''; }
    }

    private _isColorPicker(): boolean {
        return this.isMoqups && !this.isMoqupLine;
    }

    private _setBackgroundColorSquare(): string {
        if (this._isColorPicker() && ControlType.Square === this.control.type) {
            return this.rgbaColor ? this.rgbaColor : '';
        } else { return ''; }
    }
}
