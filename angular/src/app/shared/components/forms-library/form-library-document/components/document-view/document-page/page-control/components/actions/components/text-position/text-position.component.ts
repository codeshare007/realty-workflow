import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { IControlActions, SelectedValue, TypeControlAction } from '@app/shared/components/forms-library/models/table-documents.model';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlLayer } from '@shared/service-proxies/service-proxies';
import { DocumentPageHelperServices } from '../../../../../services/document-page-helper.service';

@Component({
    selector: 'text-position',
    templateUrl: './text-position.component.html',
})
export class TextPositionComponent extends AppComponentBase {

    @Input() control: ControlEditDto;
    @Input() mainLayer: ControlLayer;
    @Input() controlIndex: number;
    @Input() showTextPosition = false;

    @Output() showTextPositionChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onControlActions: EventEmitter<IControlActions> = new EventEmitter<IControlActions>();

    get fontPositionList(): SelectedValue[] {
        return this._controlHelper.fontPositionList;
    }

    constructor(
        injector: Injector,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _controlHelper: DocumentPageHelperServices,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
    }

    public toggleTextPosition(): void {
        this.showTextPositionChange.emit(!this.showTextPosition);
    }

    public selectPosition(item: SelectedValue): void {
        if (this._multiSelectControlsService.isMultiSelected(this.control)) {
            this._multiSelectControlsService.editControlTextPosition(item.value, this.mainLayer);
            this._multiSelectControlsService.setReloadMultiControl(true);
        }
        this.control.textPosition = item.value;
        this.onControlActions.emit(new IControlActions(TypeControlAction.TextPosition, this.controlIndex));
        this._cdr.detectChanges();
    }
}
