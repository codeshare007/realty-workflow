import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlLayer, ControlType } from '@shared/service-proxies/service-proxies';
import { get, isNumber } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { IDragDropEvent, SwitchSetting, ViewMode, ViewModesType } from '../../../models/table-documents.model';
import { DndService } from '../../../services/drag-drop.service';
import { FormControlsService } from './services/form-controls.service';
import { FormLibraryDocumentService } from './services/form-library-document.service';


@Component({
    selector: 'form-library-controls',
    templateUrl: './form-library-controls.component.html',
    providers: [FormControlsService],
})
export class FormLibraryControlsComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.form-library-controls') class = true;

    @Output() onDropped: EventEmitter<IDragDropEvent> = new EventEmitter<IDragDropEvent>();

    @Input() formLibrarySettings: SwitchSetting;

    formControls: ControlEditDto[] = [];
    layer: ControlLayer = ControlLayer.Form;
    isEditMod = true;

    constructor(
        injector: Injector,
        private _formControlsService: FormControlsService,
        private _cdk: ChangeDetectorRef,
        private _dndService: DndService,
        private _formLibraryDocumentService: FormLibraryDocumentService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.formControls = this._formControlsService.controls;
        this._formLibraryDocumentService.getModeChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ViewMode) => {
                if (result) {
                    this.isEditMod = result.type === ViewModesType.Edit ? result.value : false;
                }
                this._cdk.markForCheck();
            });
    }

    public isHover(type: ControlType): boolean {
        return this._dndService.onDnd
            && this._dndService.moveDnd
            && isNumber(get(this._dndService.control, 'type'))
            && type === this._dndService.control.type;
    }

    public getControlClass(): string {
        let controlClass = 'form-library-controls__wrapper__list__item-control';

        return controlClass;
    }

    public onSelected(event, libraryControl: HTMLDivElement, item: ControlEditDto): void {
        if (!this.isEditMod) { return; }

        event.preventDefault();
        this._dndService.onDnd = true;
        this._dndService.control = item;
        this._dndService.startDnd(libraryControl);
    }

    public onSwitch(viewModes, type: ViewModesType): void {
        const radioSwitch = (mode) => {
            mode.map((item) => item.value = false);
        };
        radioSwitch(viewModes);
        viewModes.map((item) => {
            if (type === item.type) {
                item.value = true;
            }
        });
    }
}
