import { ChangeDetectorRef, Component, HostBinding, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageControlService } from '@app/shared/components/forms-library/form-library-document/components/document-view/document-page/page-control/components/services/page-control.service';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { AccessSettingLayer, AccessSettingType, AccessTypeItem, IBoxPosition, SwitchSetting, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { PageLinePipe } from '@app/shared/components/forms-library/pipes/page-line.pipe';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { FormLibraryControlsSettingService } from '@app/shared/components/forms-library/services/form-library-controls-setting.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { PageLinesService } from '@app/shared/components/forms-library/services/page-lines.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer, FormEditDto, LibraryFormEditDto, LibraryFormServiceProxy, UpdateLibraryFormInput } from '@shared/service-proxies/service-proxies';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { FormLibraryReportService } from '../library-form-report.service';
import { FormLibraryDocumentHelperService } from './services/form-library-document-helper.service';
import { FormLibraryReloadService } from './services/form-library-reload.service';

@Component({
    templateUrl: './form-library-document.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, PageLinePipe, FormLibraryControlsSettingService],
})
export class FormLibraryDocumentComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.form-library-document') class = true;

    formId: string;
    libraryForm: LibraryFormEditDto;
    switchSetting: SwitchSetting;
    loading = false;
    accessLayers: AccessSettingLayer = new AccessSettingLayer(ControlLayer.Library, [ControlLayer.Library]);
    accessTypeItem: AccessTypeItem = new AccessTypeItem();

    get controlLayer() {
        return ControlLayer;
    }
    get boxPosition(): IBoxPosition {
        return this._dndService.boxPositions;
    }
    get dragebleElement(): string {
        return this._dndService.elementHtml;
    }
    get isHover(): boolean {
        return this._dndService.onDnd
            && this._dndService.moveDnd
            && this._dndService.isDragging;
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _dndService: DndService,
        private _libraryFormService: LibraryFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _formLibraryControlsSettingService: FormLibraryControlsSettingService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _controlDetailsService: ControlDetailsService,
        private _pageControlService: PageControlService,
        private _pageLinePipe: PageLinePipe,
        private _formLibraryReportService: FormLibraryReportService,
        private _pageLinesService: PageLinesService,

    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._initDocument();
        this._formLibraryReloadService.getLoadingChange$()
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe((result: boolean) => {
                if (result) {
                    this.saveForm();
                }
                this._cdr.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._pageControlService.setReloadMode(true);
    }

    public saveForm(): void {
        this.loading = true;

        const input = new UpdateLibraryFormInput();
        input.id = this.libraryForm.id;
        input.form = this._formLibraryDocumentHelper.mapFormDto(this.libraryForm.form);

        this._libraryFormService.update(input)
            .pipe(finalize(() => {
                this.loading = false;
                this._pageLinesService.movedControl = false;
            }))
            .subscribe(() => {
                this._removeMultiSelect();
                this.notify.success(this.l('SuccessfullySaved'));
                this._loadFormDocument();
            });
    }

    private _removeMultiSelect(): void {
        this._multiSelectControlsService.multiControls = [];
    }

    private _initDocument(): void {
        this._activatedRoute
            .params
            .pipe(
                takeUntil(this.onDestroy$)
            )
            .subscribe((params) => {
                this.formId = params['libraryFormId'];
                if (this.formId) {
                    this._loadFormDocument();
                }
            });
    }

    private _loadFormDocument(): void {
        this.loading = true;

        this._libraryFormService.getForEdit(this.formId, undefined)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: LibraryFormEditDto) => {
                this.libraryForm = result;
                this.accessTypeItem = new AccessTypeItem(
                    AccessSettingType.FormLibrary, this.libraryForm.id
                );
                this._pageLinePipe.transform([this.libraryForm.form]);
                this._getSetting(this.libraryForm.form);
                this._controlDetailsService.setIsControlSelected(false);
            });
    }

    private _getSetting(document: FormEditDto): void {
        this._formLibraryControlsSettingService.isLibrary = true;
        this.switchSetting = this._formLibraryControlsSettingService
            .getSetting(document, ControlLayer.Library, ViewModesType.Edit);
    }

    generateReport() {
        this._formLibraryReportService.downloadReport(this.libraryForm.form.id, this.libraryForm.form.name, () => {
            //finish report generation
        });
    }
}
