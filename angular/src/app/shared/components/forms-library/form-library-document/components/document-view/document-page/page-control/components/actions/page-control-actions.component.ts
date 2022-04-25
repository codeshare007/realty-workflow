import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { ControlValueInput, CopyControlType, IControlActions, SelectedValue, TypeControlAction } from '@app/shared/components/forms-library/models/table-documents.model';
import { DocumentControlHealperService } from '@app/shared/components/forms-library/services/document-controller-helper.service';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlLayer, ControlType, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';
import { get, isEmpty, isNull, isNumber } from 'lodash';
import { ColorEvent, RGBA } from 'ngx-color/public_api';
import { delay } from 'rxjs/operators';
import { DocumentPageHelperServices } from '../../../services/document-page-helper.service';
import { FadeState } from '../../page-control.component';

@Component({
    selector: 'page-control-actions',
    templateUrl: './page-control-actions.component.html',
    animations: [
        trigger('state', [
            state(
                'visible',
                style({
                    width: '100%'
                })
            ),
            state(
                'hidden',
                style({
                    width: '0'
                })
            ),
            transition('* => visible', [animate('200ms ease-out')]),
            transition('visible => hidden', [animate('200ms ease-out')])
        ])
    ],
})
export class PageControlActionsComponent extends AppComponentBase implements OnChanges, OnInit {

    @Input() mainLayer: ControlLayer;
    @Input() participants: ContactListDto[] = [];
    @Input() controlIndex: number;
    @Input() pageId: string;
    @Input() documentId: string;
    @Input() control: ControlEditDto;
    @Input() rgbaColor: string;
    @Input() isDisabledDragging: boolean;
    @Input() participantMappingItems: ParticipantMappingItemDto[];

    @Output() rgbaColorChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onControlActions: EventEmitter<IControlActions> = new EventEmitter<IControlActions>();
    @Output() onMultipleCopy: EventEmitter<number> = new EventEmitter<number>();
    @Output() onChangeClass: EventEmitter<any> = new EventEmitter<any>();
    @Output() isDisabledDraggingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public controlType = ControlType;
    public controlLayer = ControlLayer;

    private _showSettings: boolean;

    isAllowedSetting = false;
    showDropDownAssign = false;
    showCopyDropDown = false;
    showDropDown = false;
    showTextSize = false;
    showColoPicker = false;
    showTextPosition = false;
    showParticipantSetting = false;
    state: FadeState;
    colorState: RGBA;
    fontSizeList: SelectedValue[];
    typeControlAction = TypeControlAction;
    copyList: SelectedValue[] = [
        new SelectedValue('Copy', CopyControlType.Single),
        new SelectedValue('Copy to other pages', CopyControlType.Multiple),
    ];

    get showSettings() {
        return this._showSettings;
    }
    set showSettings(value: boolean) {
        if (value) {
            this._showSettings = value;
            this.state = 'visible';
        } else {
            this.state = 'hidden';
        }
    }
    get isMoqups(): boolean {
        return this._controlHealper.isMoqups(this.control.type);
    }
    get isMoqupLine(): boolean {
        return this._controlHealper.isMoqupLine(this.control.type);
    }

    constructor(
        injector: Injector,
        private _documentPageHelper: DocumentPageHelperServices,
        private _controlHealper: DocumentControlHealperService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
        this.fontSizeList = this._documentPageHelper.fontSizeList;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (isNumber(this.mainLayer) && !isEmpty(this.control)) {
            this.isAllowedSetting = this.mainLayer === this.control.layer;
        }
    }

    ngOnInit(): void {
        this.rgbaColor = this.control.value ? this.control.value.value : undefined;
        this.rgbaColorChange.emit(this.rgbaColor);
        this._setColorState();
    }

    public toggleDropDownAssign(): void {
        this.showDropDownAssign = !this.showDropDownAssign;
    }

    public toggleCopyDropDown(): void {
        this.showCopyDropDown = !this.showCopyDropDown;
    }

    public toggleTextSize(): void {
        this.showTextSize = !this.showTextSize;
    }

    public toggleTextPosition(): void {
        this.showTextPosition = !this.showTextPosition;
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    public toggleParticipantSetting(): void {
        this.showParticipantSetting = !this.showParticipantSetting;
    }

    public toggleColorPicker(): void {
        this.showColoPicker = !this.showColoPicker;
        this.isDisabledDraggingChange.emit(this.showColoPicker);
    }

    public onActions(type: TypeControlAction): void {
        switch (type) {
            case TypeControlAction.Assign:
                this.toggleDropDownAssign();
                break;
            case TypeControlAction.Copy:
                if (this.mainLayer === ControlLayer.Signing) {
                    this.toggleCopyDropDown();
                } else {
                    this.onControlActions.emit(new IControlActions(type, this.controlIndex));
                }
                break;
            case TypeControlAction.Delete:
                this.onControlActions.emit(new IControlActions(type, this.controlIndex));
                break;
            case TypeControlAction.TextSize:
                this.toggleTextSize();
                break;
            case TypeControlAction.TextPosition:
                this.toggleTextPosition();
                break;
            case TypeControlAction.ColorPicker:
                this.toggleColorPicker();
                break;
            case TypeControlAction.DropdownControl:
                this.toggleDropDown();
                break;
            case TypeControlAction.TempControl:
                this._formLibraryReloadService.setLoadingChange(true);
                break;
            case TypeControlAction.ParticipantSetting:
                this.toggleParticipantSetting();
                break;
        }
        this._cdr.detectChanges();
    }

    public isShowAction(): boolean {
        return !isEmpty(this._documentPageHelper.page.controls[this.controlIndex])
            ? this._documentPageHelper.page.controls[this.controlIndex].showActions
            : false;
    }

    public animationDone(event): void {
        if (event.fromState === 'visible' && event.toState === 'hidden') {
            this._showSettings = false;
        }
    }

    public onControlSetting(): void {
        this.showSettings = this.showSettings ? false : true;
        this._cdr.detectChanges();
    }

    public cancelColor(key?: boolean): void {
        this.rgbaColor = this.control.value ? this.control.value.value : undefined;
        this.rgbaColorChange.emit(this.rgbaColor);
        if (!key) {
            this.toggleColorPicker();
        }
        this._setColorState();
    }

    public colorPickerChange(event: ColorEvent): void {
        const { r, g, b, a } = event.color.rgb;
        this.rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.rgbaColorChange.emit(this.rgbaColor);
    }

    public saveColorPicker(): void {
        if (this.rgbaColor && this.rgbaColor !== get(this.control, ['value', 'value'])) {
            this._saveColorPicker();
        } else {
            this.showColoPicker = !this.showColoPicker;
            this._setColorState();
        }
    }

    public selectCopy(item: SelectedValue): void {
        if (item.value === CopyControlType.Multiple) {
            this.onMultipleCopy.emit(this.controlIndex);
        } else {
            this.onControlActions.emit(new IControlActions(TypeControlAction.Copy, this.controlIndex));
        }
        this.toggleCopyDropDown();
    }

    public isControlTemp(): boolean {
        return this.control.id.includes('Temp');
    }

    public selectSize(item: SelectedValue): void {
        if (this.isMultiSelected()) {
            this._multiSelectControlsService.editControlSize(item.value, this.mainLayer);
            this._multiSelectControlsService.setReloadMultiControl(true);
        }
        this.control.font.sizeInPx = item.value;
        this.onControlActions.emit(new IControlActions(TypeControlAction.TextSize, this.controlIndex));
        this._cdr.detectChanges();
    }

    public onParticipantSelect(event: ContactListDto): void {
        if (!isNull(event)) {
            if (this.isMultiSelected()) {
                this._multiSelectControlsService.editControlParticipant(event.id);
                this._multiSelectControlsService.setReloadMultiControl(true);
            }
            this.control.participantId = event.id;
            this.onChangeClass.emit();
            this._cdr.detectChanges();
        } else {
            if (this.isMultiSelected()) {
                this._multiSelectControlsService.editControlParticipant(undefined);
                this._multiSelectControlsService.setReloadMultiControl(true);
            }
            this.control.participantId = undefined;
            this.onChangeClass.emit();
            this._cdr.detectChanges();
        }
    }

    private _setColorState(): void {
        if (this.rgbaColor && this.rgbaColor.includes('rgba(')) {
            this.colorState = this._controlHealper.getColorStage(this.rgbaColor);
            this._cdr.detectChanges();
        }
    }

    private _saveColorPicker(): void {
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = this.control.id;
        input.formId = this.documentId;
        input.pageId = this.pageId;
        input.value = this.rgbaColor;

        this._httpService.post(this._formUrlService.controlUrl, input)
            .pipe(delay(0))
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                this._setColorState();
                this.toggleColorPicker();
                this._cdr.markForCheck();
            });
    }

    private isMultiSelected(): boolean {
        return this._multiSelectControlsService.isMultiSelected(this.control);
    }
}
