import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Injector, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SigningFormDesignPage } from '@app/admin/signings/signing-form-design/services/signing-form-design-page.service';
import { SigningFormDesignReloadService } from '@app/admin/signings/signing-form-design/services/signing-form-design-reload.service';
import { AccessSettingLayer, ControlLineDot, IControlActions, IControlParticipant, MouseClientCoordinate, MultipleCopyControl, PageEdit, PageLine, StatusPage, StickingPosition, TypeControlAction } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlCopyPasteService } from '@app/shared/components/forms-library/services/control-copy-paste.service';
import { ControlDeleteService } from '@app/shared/components/forms-library/services/control-delete.service';
import { DocumentControlHealperService } from '@app/shared/components/forms-library/services/document-controller-helper.service';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { PageLinesService } from '@app/shared/components/forms-library/services/page-lines.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlLayer, ControlType, PageEditDto, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep, get, isEmpty, isNumber, isUndefined } from 'lodash';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { FormControlsService } from '../../form-controls/services/form-controls.service';
import { DocumentPageHelperServices } from './services/document-page-helper.service';

@Component({
    selector: 'document-page',
    templateUrl: './document-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DocumentPageHelperServices]
})
export class DocumentPageComponent extends AppComponentBase implements OnChanges, OnInit, OnDestroy {

    @HostBinding('class.document-page') class = true;

    @ViewChild('onMouseRef', { static: true }) element: ElementRef;

    @Input() mainLayer: ControlLayer;
    @Input() page: PageEditDto;
    @Input() participantId: string;
    @Input() participants: ContactListDto[];
    @Input() accessSetting: AccessSettingLayer;
    @Input() publicMode: boolean;
    @Input() documentId: string;
    @Input() adminView: boolean;
    @Input() participantMappingItems: ParticipantMappingItemDto[];
    @Input() pageHeight: number;
    @Input() pageWidth: number;
    
    @Output() controlDropped: EventEmitter<any> = new EventEmitter<any>();

    pageEdit: PageEdit;
    controlIndex: number;
    draggingControlId: string;
    urlPage: Object;
    stickingVertical: number;
    stickingHorisontal: number;

    readonly controlType = ControlType;

    get isShowStickingBlock(): boolean {
        return isNumber(this.stickingVertical) && isNumber(this.stickingHorisontal);
    }
    get controlParticipants(): IControlParticipant[] {
        return this.mainLayer !== ControlLayer.Signing
            ? this._formControlsService.controlParticipantsSetting
            : this._formControlsService.controlParticipants;
    }
    get dndControl(): ControlEditDto {
        return isEmpty(this._dndService.control)
            ? this._pageLinesService.controlEdit
            : this._dndService.control;
    }
    get isDndControl(): boolean {
        if (this._dndService.control) {
            return true;
        } else if (this._pageLinesService.controlEdit) {
            const findIndex = this.page.controls.findIndex((control) => {
                if (!this.draggingControlId) { return; }

                return control.id === this.draggingControlId;
            });
            if (findIndex !== -1) {
                return this.page.controls[findIndex].id === this._pageLinesService.controlEdit.id;
            }
        }
    }
    get statusPage() {
        return StatusPage;
    }
    get isHover(): boolean {
        return (this._dndService.onDnd
            && this._dndService.moveDnd
            && this._dndService.isDragging)
            || this._pageLinesService.movedControl;
    }

    get showLine(): boolean {
        return this._multiSelectControlsService.multiControls.length > 0;
    }

    @HostListener('document:mousemove', ['$event'])
    mousemove(event: MouseEvent) {
        if (this._pageLinesService.pageId === this.page.id
            && this._isListeningOn()) {
            this._dndService.setLineChange(new MouseClientCoordinate(event.clientX, event.clientY));
        }
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _dndService: DndService,
        private _documentPageHelper: DocumentPageHelperServices,
        private _signingFormDesignPage: SigningFormDesignPage,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _formControlsService: FormControlsService,
        private _pageLinesService: PageLinesService,
        private _controlHealper: DocumentControlHealperService,
        private _controlCopyPasteService: ControlCopyPasteService,
        private _controlDeleteService: ControlDeleteService,
        private _signingFormDesignReloadService: SigningFormDesignReloadService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.page) {
            this._setControls();
            this.urlPage = {
                'background-image': `url(${AppConsts.remoteServiceBaseUrl}/SystemFile/getfile/${this.page.fileId})`,
                'background-size': this.pageWidth == 0 ? '1240px 1754px' : '1240px auto',
                'background-repeat': 'no-repeat'
            };
            this._cdr.detectChanges();
        }
    }

    ngOnInit(): void {
        this._onCopyMultiControl();
        this._reloadCopyControl();
        this._getLineChange();
        this._getStickingControl();
        this._getCopyPasteControl();
        this._getCtrlDeleteControl();
        this._getReloadBackground();
    }

    private _getReloadBackground(): void {
        this._signingFormDesignReloadService.getReloadBackground$()
            .pipe(
                takeUntil(this.onDestroy$)
            )
            .subscribe((result) => {
                this.urlPage = {
                    'background-image': `url(${AppConsts.remoteServiceBaseUrl}/SystemFile/getfile/${this.page.fileId})`
                };
                this._cdr.markForCheck();
            });
    }

    public styleControl(): Object {
        const sizePadding = 11;

        return {
            'width.px': this.dndControl.size.width,
            'height.px': this.dndControl.size.height,
            'fontSize.px': this.dndControl.font.sizeInPx,
            'minHeight.px': this.dndControl.font.sizeInPx + sizePadding,
        };
    }

    public isNotDnDControl(control: ControlEditDto): boolean {
        return !isUndefined(this._dndService.control)
            && get(this._dndService.control, 'id') !== control.id;
    }

    public getPageLineControls(): PageLine {
        const find = this._pageLinesService.pageLines.find((page) => {
            return page.pageId === this.page.id;
        });
        const pageInput = find ? find : new PageLine();

        return pageInput;
    }

    public getDragHorizontalDots(): number[] {
        return this._pageLinesService.dragHorizontalDots;
    }

    public getDragVerticalDots(): number[] {
        return this._pageLinesService.dragVerticalDots;
    }

    public isMoqups(type: ControlType): boolean {
        return this._controlHealper.isMoqups(type);
    }

    public onAddedControlDots(event: MouseClientCoordinate): void {
        this._pageLinesService.resetPageLine(this.page);
        this._pageLinesService.controlEdit = undefined;
        this._cdr.detectChanges();
    }

    public onRemovedControlDots(control: ControlEditDto): void {
        const findIndex = this.page.controls.findIndex((item) => {
            return item.id === control.id;
        });
        this._pageLinesService.page = cloneDeep(this.page);
        this._pageLinesService.controlEdit = control;
        const clonedPage = cloneDeep(this.page);
        clonedPage.controls.splice(findIndex, 1);
        this._pageLinesService.resetPageLine(clonedPage);
        this._cdr.detectChanges();
    }

    public onControlAction(event: IControlActions): void {
        switch (event.type) {
            case TypeControlAction.Assign:
                break;
            case TypeControlAction.Copy:
                this._singleCopyProcces(event.index);
                this._setControls();
                break;
            case TypeControlAction.Delete:
                if (this._isMultiSelected(event.index)) {
                    this._deleteControls();
                } else {
                    this._deleteControl(event.index);
                }
                this._setControls();
                break;
            case TypeControlAction.TextSize:
                this._setControls();
                break;
            case TypeControlAction.TextPosition:
                this._setControls();
                break;
        }
    }

    public onMultipleCopy(controlIndex: number) {
        const input: MultipleCopyControl = new MultipleCopyControl(
            cloneDeep(this.page.controls[controlIndex]),
            this.documentId, this.page.id, controlIndex
        );
        if (this._multiSelectControlsService.multiControls.length > 1) {
            this._signingFormDesignPage.setCopyMultipleControls(input);
        } else {
            this._signingFormDesignPage.setCopyControls(input);
        }
        this._cdr.markForCheck();
    }

    public onMouseEvent(event: MouseEvent, state: StatusPage): void {
        switch (state) {
            case StatusPage.Allowed:
                if (isNumber(get(this._dndService.control, 'type'))) {
                    this._formControlSaved(event);
                } else if (isNumber(get(this._dndService.pageControl, 'type'))) {
                }
                break;
            case StatusPage.Denied:
                this._dndService.control = null;
                break;
        }
    }

    public onControlMove(event: MouseEvent): void {
        if (this._pageLinesService.pageId !== this.page.id) {
            this._pageLinesService.pageId = this.page.id;
            this._pageLinesService.page = cloneDeep(this.page);
        }

        if (!this.isHover && isNumber(get(this._dndService.control, 'type'))) {
            this._formControlSaved(event);
        }
    }

    private _isListeningOn(): boolean {
        return (this._dndService.onDnd
            && this._dndService.moveDnd
            && this._dndService.isDragging)
            && !this._pageLinesService.movedControl;
    }

    private _deleteControls(): void {
        this._multiSelectControlsService.setDeleteMultiControl(this.mainLayer);
        this._pageLinesService.resetPageLine(this.page);
    }

    private _getLineChange(): void {
        this._dndService.getLineChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((event: MouseClientCoordinate) => {
                if (!event) { return; }

                if (this._pageLinesService.pageId === this.page.id) {
                    const rect = this.element.nativeElement.getBoundingClientRect();
                    const xLeft = event.clientX - rect.left;
                    const yTop = event.clientY - rect.top;
                    const controlLineDot = !event.isCtrlMove
                        ? new ControlLineDot(Math.floor(xLeft), Math.floor(yTop))
                        : new ControlLineDot(event.clientX, event.clientY);
                    this.draggingControlId = event.control && event.control.id;
                    this._pageLinesService.setDragControl(controlLineDot, event.control);
                    this._cdr.markForCheck();
                }
            });
    }

    private _singleCopyProcces(index: number): void {
        if (this._multiSelectControlsService.multiControls.length > 1) {
            this._multiSelectControlsService.setCopyMultiControl(this.mainLayer);
        } else {
            this._copyControl(index);
        }
    }

    private _reloadCopyControl(): void {
        this._signingFormDesignPage.getReloadCopyControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                this._setControls();
                this._cdr.markForCheck();
            });
    }

    private _setControls(): void {
        this._documentPageHelper.page = this._documentPageHelper.mapPageEditDto(this.page);
        this._cdr.detectChanges();
    }

    private _deleteControl(index: number): void {
        this.page.controls.splice(index, 1);
    }

    private _isMultiSelected(index: number): boolean {
        return this._multiSelectControlsService.isMultiSelected(this.page.controls[index]);
    }

    private _onCopyMultiControl(): void {
        this._multiSelectControlsService.getCopyMultiControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((mainLayer: ControlLayer) => {
                if (isNumber(mainLayer)) {
                    this.page.controls.forEach((control, index) => {
                        const find = this._multiSelectControlsService.multiControls
                            .find((item) => {
                                return mainLayer === item.layer && item.id === control.id;
                            });
                        if (find) {
                            this._copyControl(index);
                        }
                    });
                    this._removeMultiSelect();
                }
            });
    }

    private _removeMultiSelect(): void {
        this._multiSelectControlsService.multiControls = [];
    }

    private _getStickingControl(): void {
        this._pageLinesService.getStickingControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: StickingPosition) => {
                const findIndex = this.page.controls.findIndex((control) => {
                    if (!this.draggingControlId) { return; }

                    return control.id === this.draggingControlId;
                });
                if (findIndex !== -1) {
                    this.stickingVertical = result.dragLeftTop.left;
                    this.stickingHorisontal = result.dragLeftTop.top;
                    this._pageLinesService.controlEdit = cloneDeep(this.page.controls[findIndex]);
                } else if (this._dndService.control) {
                    this.stickingVertical = result.dragLeftTop.left;
                    this.stickingHorisontal = result.dragLeftTop.top;
                    this._pageLinesService.controlEdit = cloneDeep(this._dndService.control);
                }
            });
    }

    private _formControlSaved(event: MouseEvent): void {
        this._dndService.control.layer = this.mainLayer;
        this._dndService.control.id = `Temp-index_${this.page.controls.length}_left-${event.offsetX
            }_top-${event.offsetY}`;
        const control = cloneDeep(this._dndService.control);
        this.page.controls.push(control);
        this._setControls();
        this._pageLinesService.changePageLine(control);
        this._dndService.control = undefined;
        this.controlDropped.emit();
        this._cdr.detectChanges();
    }

    private _copyControl(index: number): void {
        const copyControl = this._documentPageHelper.setControlEditDto(
            this.mainLayer, this.page.controls[index], this.page.controls.length
        );
        this.page.controls.push(copyControl);
        this._pageLinesService.changePageLine(copyControl);
    }

    private _getCopyPasteControl(): void {
        this._controlCopyPasteService.getCopyPasteControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                if (this._controlCopyPasteService.selectedControl.pageId !== this.page.id) {
                    return;
                }

                if (this._controlCopyPasteService.multiControls.length > 1) {
                    this.page.controls.forEach((control, index) => {
                        const find = this._controlCopyPasteService.multiControls
                            .find((item) => {
                                return item.id === control.id;
                            });
                        if (find) { this._copyControl(index); }
                    });
                    this._removeMultiSelect();
                } else {
                    this._copyControl(this._controlCopyPasteService.selectedControl.controlIndex);
                }
                this._setControls();
            });
    }

    private _getCtrlDeleteControl(): void {
        this._controlDeleteService.getCtrlDeleteControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                this._deleteControls();
            });
    }
}
