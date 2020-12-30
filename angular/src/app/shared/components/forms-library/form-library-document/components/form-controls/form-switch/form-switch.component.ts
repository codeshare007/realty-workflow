import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { SwitchSetting, ViewMode, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { takeUntil } from 'rxjs/operators';
import { DocumentViewService } from '../../document-view/services/document-view.service';
import { FormLibraryDocumentService } from '../services/form-library-document.service';


@Component({
    selector: 'form-switch',
    templateUrl: './form-switch.component.html',
})
export class FormSwitchComponent extends AppComponentBase implements OnInit {

    @Input() formLibrarySettings: SwitchSetting = new SwitchSetting();

    layer: ControlLayer;
    mode: ViewModesType = ViewModesType.Edit;

    constructor(
        injector: Injector,
        private _cdk: ChangeDetectorRef,
        private _formLibraryDocumentService: FormLibraryDocumentService,
        private _documentViewService: DocumentViewService,
        private _formLibraryReloadService: FormLibraryReloadService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._formLibraryDocumentService.getLayerChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ControlLayer) => {
                this.layer = result;
                this._formLibraryDocumentService.setModeChange(
                    this._documentViewService.getMode(this.layer)
                );
            });
    }

    public onSwitch(viewModes: ViewMode[], type: ViewModesType): void {
        const radioSwitch = (mode) => {
            mode.map((item) => item.value = false);
        };

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
                                this._formLibraryDocumentService.setModeChange(item);
                            }
                        });
                    } else {
                        this.mode = ViewModesType.Edit;
                        radioSwitch(viewModes);
                        viewModes.map((item) => {
                            if (this.mode === item.type) {
                                item.value = true;
                                this._formLibraryDocumentService.setModeChange(item);
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
                    this._formLibraryDocumentService.setModeChange(item);
                }
            });
        }
    }
}
