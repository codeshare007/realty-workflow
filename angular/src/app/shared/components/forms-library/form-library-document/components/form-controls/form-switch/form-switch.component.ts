import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { MultiplSelectedMode, SwitchSetting, ViewMode, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';
import { FormLibraryDocumentService } from '../services/form-library-document.service';


@Component({
    selector: 'form-switch',
    templateUrl: './form-switch.component.html',
})
export class FormSwitchComponent extends AppComponentBase implements OnChanges {

    @Input() switchSetting: SwitchSetting = new SwitchSetting();
    @Input() layer: ControlLayer;
    @Input() disabled: boolean;
    @Input() title: string;
    @Input() layerComponent: ControlLayer;

    resetSelect = false;
    mode: ViewModesType;

    constructor(
        injector: Injector,
        private _formLibraryDocumentService: FormLibraryDocumentService,
        private _formLibraryReloadService: FormLibraryReloadService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.layer && isNumber(this.layer)) {
            this.mode = this.layerComponent === ControlLayer.Library
                ? ViewModesType.Edit
                : ViewModesType.Populate;

            if (this.mode === ViewModesType.Edit) {
                const viewMode = new ViewMode('', ViewModesType.Edit);
                const input = new MultiplSelectedMode(this.layer, viewMode);
                setTimeout(() => {
                    this._formLibraryDocumentService.setModeChange(input);
                });
            }
        }
    }

    public onSwitch(viewModes: ViewMode[], selected: SelectItem): void {
        const radioSwitch = (mode) => {
            mode.map((item) => item.value = false);
        };
        const type = selected.data.type;

        if (this.mode === ViewModesType.Edit && type === ViewModesType.Populate) {
            this.message.confirm(
                'To move to the next mode, you need to save progress',
                this.l('AreYouSure'),
                (isConfirmed) => {
                    if (isConfirmed) {
                        this._formLibraryReloadService.setLoadingChange(true);
                        radioSwitch(viewModes);
                        viewModes.map((item) => {
                            if (type === item.type) {
                                item.value = true;
                                this.mode = item.type;
                                const input = new MultiplSelectedMode(this.layer, item);
                                this._formLibraryDocumentService.setModeChange(input);
                            }
                        });
                    } else {
                        this.resetSelect = !this.resetSelect;
                        this.mode = ViewModesType.Edit;
                        radioSwitch(viewModes);
                        viewModes.map((item) => {
                            if (this.mode === item.type) {
                                item.value = true;
                                const input = new MultiplSelectedMode(this.layer, item);
                                this._formLibraryDocumentService.setModeChange(input);
                            }
                        });
                    }
                }
            );
        } else {
            radioSwitch(viewModes);
            viewModes.map((item) => {
                if (type === item.type) {
                    item.value = true;
                    this.mode = item.type;
                    this._formLibraryReloadService.setLoadingChange(true);
                    const input = new MultiplSelectedMode(this.layer, item);
                    this._formLibraryDocumentService.setModeChange(input);
                }
            });
        }
    }
}
