import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PageControlHealperService } from '@app/admin/forms-library/form-library-document/services/page-control-helper.service';
import { AccessSettingLayer, DragPositionElement, IControlActions, IControlParticipant, ICopyPastControl, MouseClientCoordinate, MultiplSelectedMode, StatusControl, StatusControlAction, TypeControlAction, ViewMode, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlCopyPasteService } from '@app/shared/components/forms-library/services/control-copy-paste.service';
import { DocumentControlHealperService } from '@app/shared/components/forms-library/services/document-controller-helper.service';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { PageLinesService } from '@app/shared/components/forms-library/services/page-lines.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlLayer, ControlType, ControlValueDto, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { get, isEmpty, isNumber } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { SigningService } from 'signing/services/signing.service';
import { ControlDetailsService } from '../../../form-controls/services/control-details.service';
import { FormControlsService } from '../../../form-controls/services/form-controls.service';
import { FormLibraryDocumentService } from '../../../form-controls/services/form-library-document.service';
import { DocumentViewService } from '../../services/document-view.service';
import { ParticipantClassPipe } from '../pipes/participant-class.pipe';
import { DocumentPageHelperServices } from '../services/document-page-helper.service';
import { PageControlService } from './components/services/page-control.service';

export type FadeState = 'visible' | 'hidden';

@Component({
    selector: 'page-control',
    templateUrl: './page-control.component.html',
    providers: [ParticipantClassPipe],
})
export class PageControlComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {

    @ViewChild('controlRef') public controlRef: ElementRef;

    @Input() control: ControlEditDto;
    @Input() index: number;
    @Input() accessSetting: AccessSettingLayer;
    @Input() participants: ContactListDto[] = [];
    @Input() participantMappingItems: ParticipantMappingItemDto[];
    @Input() participantId: string;
    @Input() pageId: string;
    @Input() mainLayer: ControlLayer;
    @Input() publicMode = false;
    @Input() adminView: boolean;
    @Input() documentId: string;

    @Output() onControlActions: EventEmitter<IControlActions> = new EventEmitter<IControlActions>();
    @Output() onMultipleCopy: EventEmitter<number> = new EventEmitter<number>();
    @Output() onAddedControlDots: EventEmitter<MouseClientCoordinate> = new EventEmitter<MouseClientCoordinate>();
    @Output() onRemovedControlDots: EventEmitter<ControlEditDto> = new EventEmitter<ControlEditDto>();

    public status: StatusControl = StatusControl.Off;
    public readonly AngularResizeElementDirection = AngularResizeElementDirection;
    public controlType = ControlType;
    public statusControl = StatusControl;
    public viewModesType = ViewModesType;
    public typeControlAction = TypeControlAction;
    public statusControlAction = StatusControlAction;

    isResize = false;
    isDisabledDragging = false;
    mode: ViewModesType;
    participantClass: string;
    sizePadding = 11;
    isAllowedSetting = false;
    rgbaColor: string;
    tabIndex: number;
    dragPosition: DragPositionElement;
    width: number;
    height: number;

    get styleControl(): Object {
        const minHeight = this.isMoqups
            ? 0
            : this.control.font.sizeInPx + this.sizePadding + this.signingPadding;

        return {
            'width.px': this.control.size.width, //this._pageControlService.isInitials(this.control.type) ? (minHeight + 4) :
            'height.px': this.control.size.height,
            'fontSize.px': this._pageControlHealperService.getFontSize(this.control),
            'textAlign': this.getTextPosition(this.control),
            'minHeight.px': minHeight,
            'justify-content': this._controlHealper.textPositionFlex(this.control),
            'minWidth': (minHeight + 4) + 'px', //this._pageControlService.isInitials(this.control.type) ? 'min-content' :
        };
    }
    get signingPadding(): number {
        if (this._pageControlService.isSigningOptional(this.control.type)) {
            return 26;
        } else if (this._pageControlService.isSigning(this.control.type)) {
            return 20;
        }

        return 0;
    }
    get isHasMatch(): boolean {
        if (get(this._pageLinesService.controlEdit, 'id') === this.control.id) {
            return this._pageLinesService.isHasMatch;
        }
    }
    get isMovedControl(): boolean {
        return this._pageLinesService.movedControl;
    }
    get isExceptionControl(): boolean {
        if (!this.control) { return; }

        if (this.publicMode) { return false; }

        switch (this.control.type) {
            case ControlType.DateTime:
            case ControlType.TextArea:
            case ControlType.TextField:
            case ControlType.Dropdown:
                return this.mode === ViewModesType.Edit;
            default:
                return this.mode === ViewModesType.View ? false : true;
        }
    }
    get focusStartedControl(): number {
        if (isNumber(this._signingService.focusStartedControl)
            && this.publicMode) {
            return this._signingService.focusStartedControl;
        }
    }
    get isMoqups(): boolean {
        return this._controlHealper.isMoqups(this.control.type);
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _documentPageHelper: DocumentPageHelperServices,
        private _documentViewService: DocumentViewService,
        private _formLibraryDocumentService: FormLibraryDocumentService,
        private _signingService: SigningService,
        private _participantClassPipe: ParticipantClassPipe,
        private _formControlsService: FormControlsService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _controlDetailsService: ControlDetailsService,
        private _pageControlService: PageControlService,
        private _pageLinesService: PageLinesService,
        private _controlHealper: DocumentControlHealperService,
        private _dndService: DndService,
        private _controlCopyPasteService: ControlCopyPasteService,
        private _pageControlHealperService: PageControlHealperService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control || changes.participantMappingItems) {
            this._changeClass();
            this._cdr.detectChanges();
        }

        if (isNumber(this.mainLayer) && !isEmpty(this.control)) {
            this.isAllowedSetting = this.mainLayer === this.control.layer;
        }

        if (!isEmpty(this.control)) {
            this.width = this.control.size.width;
            this.height = this.control.size.height;
            this._cdr.detectChanges();
        }
    }

    ngOnInit(): void {
        if (!isEmpty(this._documentViewService.formSetting.viewModeSettings)
            // && !isEmpty(this._documentViewService.getMode(this.control.layer))
        ) {
            const view: ViewMode = this._documentViewService.getMode(this.control.layer);

            this.mode = view ? view.type : ViewModesType.Populate;
            // if (this.control.layer === ControlLayer.Signing) {
            //     console.log('this.mode: 1', this._getTESTmode(this.mode), view.type);
            // }
            this._cdr.detectChanges();
        }
        if (this.publicMode) {
            this._setFilledProgress();
            this._setTabIndex();
        }
        this._reloadingMultiControl();
        this._getReloadControl();
        // this._getReloadMode();
        if (this.adminView) {
            this.mode = ViewModesType.View;
            // console.log('this.mode: 2', this._getTESTmode(this.mode));
        }

        if (get(this.control, ['value', 'value'])) {
            this.rgbaColor = this.control.value.value;
        }
    }

    ngAfterViewInit() {
        this._formLibraryDocumentService.getModeChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: MultiplSelectedMode) => {
                this.mode = result.viewMode.type;
                // console.log('this.mode: 3', this._getTESTmode(this.mode));
                this._removeMultiSelection(result.layer);
                this._cdr.markForCheck();
            });
    }

    public getTextPosition(control: ControlEditDto): string {
        return this._controlHealper.textPositionType(control);
    }

    public getFontSize(control: ControlEditDto): number {
        return this._pageControlHealperService.getFontSize(control);
    }

    public isSigning(): boolean {
        return this._pageControlService.isSigning(this.control.type);
    }

    public isDisabledDraging(): boolean {
        return this.isAllowedSetting ? this.isResize : !this.isAllowedSetting;
    }

    public isControlFull(): boolean {
        return !isEmpty(get(this.control, ['value', 'value']));
    }

    public isMultiSelected(): boolean {
        return this._multiSelectControlsService.isMultiSelected(this.control);
    }

    public setTabIndex(): void {
        this._signingService.focusStartedControl = this.tabIndex;
    }

    public getControlValue(value: ControlValueDto): string {
        if (!value) { return ''; }

        if (this.isSigning()) {
            const json = JSON.parse(value.value);

            return json.data;
        } else {
            return value.value;
        }
    }

    public multiSelect(event: MouseEvent): void {
        this._controlCopyPasteService.selectedControl = new ICopyPastControl(
            this.control, this.index, this.pageId
        );
        if (event.ctrlKey) {
            this._multiSelectControlsService.editMultiControls(this.control, this.index);
        } else {
            if (this.isMultiSelected()) { return; }

            this._multiSelectControlsService.multiControls = [];
            this._multiSelectControlsService.editMultiControls(this.control, this.index);
        }
    }

    public isPublicPopulate(): boolean {
        return this.participantId === this.control.participantId;
    }

    public isShowAction(): boolean {
        return !isEmpty(this._documentPageHelper.page.controls[this.index])
            ? this._documentPageHelper.page.controls[this.index].showActions
            : false;
    }

    public onChangeClass(): void {
        this._changeClass();
    }

    public isBase64(): boolean {
        const controlValue = get(this.control, ['value', 'value']);
        if (controlValue) {
            const json = JSON.parse(controlValue);
            return controlValue ? json.data.includes('data:image/png;base64') : false;
        }
    }

    public onDragingEnded(move: CdkDragEnd): void {
        const { offsetLeft, offsetTop } = move.source.element.nativeElement;
        const { x, y } = move.distance;
        let left = this.control.position.left + (offsetLeft + x);
        let top = this.control.position.top + (offsetTop + y);
        if (this._pageLinesService.position) {
            left = this._pageLinesService.position.left;
            top = this._pageLinesService.position.top;
        }
        this.control.position.left = left;
        this.control.position.top = top;
        this._pageLinesService.movedControl = false;
        this._pageLinesService.position = undefined;
        this.onAddedControlDots.emit(
            new MouseClientCoordinate(left, top, this.control)
        );
        this._cdr.detectChanges();
    }

    public onDragingStarted(move: CdkDrag): void {
        if (this._pageLinesService.pageId !== this.pageId) {
            this._pageLinesService.pageId = this.pageId;
        }

        this.onRemovedControlDots.emit(this.control);
        this._pageLinesService.movedControl = true;
    }

    public onControlMoved(move): void {
        const { left, top } = move.source.element.nativeElement.getBoundingClientRect();
        const mouseLeft = move.event.clientX;
        const mouseTop = move.event.clientY;
        const diffLeft = mouseLeft - left;
        const diffTop = mouseTop - top;
        const coordinateLeft = move.event.clientX - Math.floor(diffLeft) - 2;
        const coordinateTop = move.event.clientY - Math.floor(diffTop) - 2;

        this._dndService.setLineChange(
            new MouseClientCoordinate(
                coordinateLeft, coordinateTop, this.control
            )
        );
    }

    public onResize(event: AngularResizeElementEvent): void {
        if ((this.control.font.sizeInPx
            + this.sizePadding
            + this.signingPadding) < event.currentHeightValue
            || this.isMoqups
        ) {
            this.control.size.height = event.currentHeightValue;
            this.height = this.control.size.height;
        }
        this.control.size.width = event.currentWidthValue;
        this.width = this.control.size.width;
        this._cdr.detectChanges();
    }

    // public onResizeTop(event: AngularResizeElementEvent): void {
    //     this.widthTop = event.differenceWidthValue;
    //     this.heightTop = event.differenceHeightValue;
    //     console.log('event: ', event, this.control.size);
    //     this._cdr.detectChanges();
    // }

    public resizeEnd(event: AngularResizeElementEvent): void {
        this.isResize = false;
    }

    public resizeStart(event: AngularResizeElementEvent): void {
        this.isResize = true;
    }

    public getValueSrc(value: string): string {
        return JSON.parse(value).data;
    }

    public changeStyle(statys: StatusControlAction): void {
        if (statys === StatusControlAction.Show) {
            this._documentPageHelper.setActionShow(this.index, true);
        } else if (statys === StatusControlAction.Hide) {
            this._documentPageHelper.setActionShow(this.index, false);
        }
        this._cdr.detectChanges();
    }

    public selectControl(): void {
        if (this.isMoqups) {
            this._controlDetailsService.selectControlDetails(undefined, true);
            return;
        }

        this._controlDetailsService.setSelectControl(this.control);
        this._controlDetailsService.setIsControlSelected(true);
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.control, this.participantId);
    }

    private _removeMultiSelection(swichedLayer: ControlLayer): void {
        if (this.mode !== ViewModesType.Edit
            && this.isMultiSelected()
            && this.control.layer === swichedLayer) {
            this._multiSelectControlsService.removeSelection(this.control);
        }
    }

    private _reloadingMultiControl(): void {
        this._multiSelectControlsService.getReloadMultiControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                if (result && this.isMultiSelected()) {
                    this._changeClass();
                    this.onRemovedControlDots.emit(this.control);
                    this._dndService.setLineChange(
                        new MouseClientCoordinate(
                            this.control.position.left, this.control.position.top, this.control, true
                        ));
                    this.onAddedControlDots.emit(
                        new MouseClientCoordinate(this.control.position.left, this.control.position.top, this.control)
                    );
                }
                this._cdr.markForCheck();
            });
    }

    private _changeClass(): void {
        const classParticipants: IControlParticipant[] = this.mainLayer !== ControlLayer.Signing
            ? this._formControlsService.controlParticipantsSetting
            : this._formControlsService.controlParticipants;
        const participantId: string = this.mainLayer !== ControlLayer.Signing
            ? this.control.participantMappingItemId
            : this.control.participantId;
        this.participantClass = this._participantClassPipe
            .transform(participantId, classParticipants);
    }

    private _setTabIndex(): void {
        const findControl = this._signingService.tabIndexControls.find((item) => {
            return item.id === this.control.id;
        });
        if (findControl) {
            this.tabIndex = findControl.tabIndex;
        }
    }

    private _getReloadControl(): void {
        this._pageControlService.getReloadControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: string) => {
                if (result && result === this.control.id) {
                    this._changeClass();
                }
                this._cdr.markForCheck();
            });
    }

    private _getReloadMode(): void {
        this._pageControlService.getReloadMode$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                if (result) {
                    this.mode = isEmpty(this._documentViewService.getMode(this.control.layer))
                        ? ViewModesType.Populate
                        : this._documentViewService.getMode(this.control.layer).type;
                    // console.log('this.mode: 4', this._getTESTmode(this.mode));
                }
                this._cdr.markForCheck();
            });
    }

    // private _getTESTmode(mode: ViewModesType): string {
    //     switch (mode) {
    //         case ViewModesType.Edit:
    //             return ' - Edit;';
    //         case ViewModesType.Populate:
    //             return ' - Populate;';
    //         case ViewModesType.View:
    //             return ' - View;';
    //     }
    // }
}
