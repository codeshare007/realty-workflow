import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IControlActions, SelectedValue, StatusControl, StatusControlAction, TypeControlAction, ViewMode, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlLayer, ControlType } from '@shared/service-proxies/service-proxies';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { isNumber } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { FormLibraryDocumentService } from '../../../form-controls/services/form-library-document.service';
import { DocumentViewService } from '../../services/document-view.service';
import { DocumentPageHelperServices } from '../services/document-page-helper.service';

@Component({
    selector: 'page-control',
    templateUrl: './page-control.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageControlComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('controlRef') public controlRef: ElementRef;

    @Input() control: ControlEditDto;
    @Input() index: number;
    @Input() documentId: string;
    @Input() pageId: string;

    @Output() onControlActions: EventEmitter<IControlActions> = new EventEmitter<IControlActions>();

    public status: StatusControl = StatusControl.Off;
    public readonly AngularResizeElementDirection = AngularResizeElementDirection;

    isResize = false;
    showSettings = false;
    mode: ViewModesType;
    layer: ControlLayer;
    sizePadding = 11;
    fontSizeList: SelectedValue[];
    showDropDown = false;

    get styleControl(): Object {
        return {
            'width.px': this.control.size.width,
            'height.px': this.control.size.height,
            'fontSize.px': this.control.font.sizeInPx,
            'minHeight.px': this.control.font.sizeInPx + this.sizePadding,
        };
    }

    public isEditMode(): boolean {
        return;
    }
    get isPopulateMode(): boolean {
        return;
    }
    get isViewMode(): boolean {
        return;
    }
    get statusControl() {
        return StatusControl;
    }
    get controlType() {
        return ControlType;
    }
    get viewModesType() {
        return ViewModesType;
    }
    get typeControlAction() {
        return TypeControlAction;
    }
    get statusControlAction() {
        return StatusControlAction;
    }

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _dndService: DndService,
        private _documentPageHelper: DocumentPageHelperServices,
        private _documentViewService: DocumentViewService,
        private _formLibraryDocumentService: FormLibraryDocumentService,
    ) {
        super(injector);
        this.fontSizeList = this._documentPageHelper.fontSizeList;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this._formLibraryDocumentService.getLayerChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ControlLayer) => {
                this.layer = result;
                if (!isNumber(this.mode)) {
                    this.mode = this._documentViewService.getMode(this.layer).type;
                }
                this._cdk.markForCheck();
            });

        this._formLibraryDocumentService.getModeChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ViewMode) => {
                this.mode = result.type;
                this._cdk.markForCheck();
            });
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    public selectSize(item: SelectedValue): void {
        this.control.font.sizeInPx = item.value;
    }

    public isShowAction(): boolean {
        return this._documentPageHelper.page.controls[this.index].showActions || this.showSettings;
    }

    public onActions(type: TypeControlAction): void {
        switch (type) {
            case TypeControlAction.Assign:
                break;
            case TypeControlAction.Coppy:
                this.onControlActions.emit(new IControlActions(type, this.index));
                break;
            case TypeControlAction.Delete:
                this.onControlActions.emit(new IControlActions(type, this.index));
                break;
            case TypeControlAction.TextSize:
                this.showDropDown = !this.showDropDown;
                this.onControlActions.emit(new IControlActions(type, this.index));
                break;
        }
    }

    public onControlMoved(move: any): void {
    }

    public onControlStoped(move: CdkDragEnd): void {
        const { offsetLeft, offsetTop } = move.source.element.nativeElement;
        const { x, y } = move.distance;
        this.control.position.left = this.control.position.left + (offsetLeft + x);
        this.control.position.top = this.control.position.top + (offsetTop + y);
        this._cdk.detectChanges();
    }

    public onResize(event: AngularResizeElementEvent): void {
        this.control.size.height = event.currentHeightValue;
        this.control.size.width = event.currentWidthValue;
    }

    public resizeEnd(event: AngularResizeElementEvent): void {
        this.isResize = false;
    }

    public resizeStart(event: AngularResizeElementEvent): void {
        this.isResize = true;
    }

    public onControlSetting(): void {
        this.showSettings = !this.showSettings;
        this._cdk.detectChanges();
    }

    public changeStyle(statys: StatusControlAction): void {
        if (statys === StatusControlAction.Show) {
            this._documentPageHelper.setActionShow(this.index, true);
            this._cdk.detectChanges();
        } else if (statys === StatusControlAction.Hide) {
            this._documentPageHelper.setActionShow(this.index, false);
            this._cdk.detectChanges();
        }
    }
}
