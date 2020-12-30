import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IControlActions, IDragDropEvent, PageEdit, StatusPage, TypeControlAction } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlType, PageEditDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep, get, isNumber } from 'lodash';
import { DocumentPageHelperServices } from './services/document-page-helper.service';

@Component({
    selector: 'document-page',
    templateUrl: './document-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DocumentPageHelperServices]
})
export class DocumentPageComponent extends AppComponentBase implements OnChanges {

    @HostBinding('class.document-page') class = true;

    @ViewChild('urlPageRef', { static: true }) element: ElementRef;

    @Output() onDropped: EventEmitter<IDragDropEvent> = new EventEmitter<IDragDropEvent>();

    @Input() page: PageEditDto;
    @Input() index: number;
    @Input() documentId: string;

    pageEdit: PageEdit;
    controlIndex: number;
    urlPage: Object;

    get statusPage() {
        return StatusPage;
    }

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _dndService: DndService,
        private _documentPageHelper: DocumentPageHelperServices,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.page) {
            this._setControls();
            this.urlPage = {
                'background-image': `url(${AppConsts.remoteServiceBaseUrl}/file/getfile/${this.page.fileId})`
            };
            this._cdk.detectChanges();
        }
    }

    public onControlAction(event: IControlActions): void {
        switch (event.type) {
            case TypeControlAction.Assign:
                break;
            case TypeControlAction.Coppy:
                this._coppyControl(event.index);
                this._setControls();
                break;
            case TypeControlAction.Delete:
                this._deleteControl(event.index);
                this._setControls();
                break;
            case TypeControlAction.TextSize:
                this._changeTextSize(event.index);
                this._setControls();
                break;
        }
    }

    public isHover(type: ControlType): boolean {
        return this._dndService.onDnd
            && this._dndService.moveDnd
            && isNumber(get(this._dndService.pageControl, 'type'))
            && type === this._dndService.pageControl.type;
    }

    public onMouseEvent(event: MouseEvent, state: StatusPage): void {
        switch (state) {
            case StatusPage.Allowed:
                if (isNumber(get(this._dndService.control, 'type'))) {
                    this._formControlSaved(event);
                } else if (isNumber(get(this._dndService.pageControl, 'type'))) {
                    // console.log('=>  PAGE   <==: ');
                    // this._pageControlSaved(event);
                }
                break;
            case StatusPage.Denied:
                this._dndService.control = null;
                break;
        }
    }

    private _formControlSaved(event: MouseEvent): void {
        // console.log('this.element.nativeElement.getBoundingClientRect(): ', this.element.nativeElement.getBoundingClientRect(), event);
        // const documentWrapper = document.querySelector('.document-view__wrapper');
        const { position } = this._dndService.control;
        // position.left = event.clientX - 495;
        // position.top = documentWrapper.scrollTop + window.scrollY + event.clientY - 291;

        position.left = event.offsetX;
        position.top = event.offsetY;
        this.page.controls.push(this._dndService.control);
        this._cdk.detectChanges();
        this._dndService.control = null;
        this._setControls();
    }

    private _setControls(): void {
        this._documentPageHelper.page = this._documentPageHelper.mapPageEditDto(this.page);
        this._cdk.detectChanges();
    }

    private _changeTextSize(index: number): void {
        this.page.controls[index].font.sizeInPx = 20;
    }

    private _deleteControl(index: number): void {
        this.page.controls.splice(index, 1);
    }

    private _coppyControl(index: number): void {
        const coppyControl = cloneDeep(this.page.controls[index]);
        coppyControl.position.left += 20;
        coppyControl.position.top += 20;
        coppyControl.id = undefined;
        this.page.controls.push(coppyControl);
    }
}
