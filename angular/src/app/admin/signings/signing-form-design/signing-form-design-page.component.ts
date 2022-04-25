import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, Injector, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormLibraryDocumentHelperService } from '@app/admin/forms-library/form-library-document/services/form-library-document-helper.service';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { PageControlService } from '@app/shared/components/forms-library/form-library-document/components/document-view/document-page/page-control/components/services/page-control.service';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { ControlCopySettingService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/controls-copy-setting.service';
import { AccessSettingLayer, AccessSettingType, AccessTypeItem, ActionsFormItem, CopyControlSettings, DocumentInfo, DocumentInfoItem, DocumentsPages, IBoxPosition, MultipleCopyControl, PageInfo, SwitchSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { FormLibraryControlsSettingService } from '@app/shared/components/forms-library/services/form-library-controls-setting.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { PageLinesService } from '@app/shared/components/forms-library/services/page-lines.service';
import { DocumentNotification } from '@app/shared/layout/notifications/DocumentNotificationHelper';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlLayer, FormEditDto, PageEditDto, SigningFormEditDto, SigningFormServiceProxy, UpdateSigningFormInput } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';
import { debounceTime, delay, finalize, takeUntil } from 'rxjs/operators';
import { SigningReportService } from '../signings-report.service';
import { SigningFormDesignPage } from './services/signing-form-design-page.service';
import { SigningFormDesignReloadService } from './services/signing-form-design-reload.service';
import { SubmitSigningModalComponent } from './submit-signing-modal/submit-signing-modal.component';

@Component({
    templateUrl: './signing-form-design-page.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, FormLibraryControlsSettingService],
})
export class SigningFormDesignComponent extends AppComponentBase implements OnInit, OnDestroy, AfterViewInit {

    @HostBinding('class.form-library-document') class = true;
    @ViewChild('submitSigningModal', { static: true }) submitSigningModal: SubmitSigningModalComponent;

    signingId: string;
    signing: SigningFormEditDto;
    loading = false;
    breadcrumbs: BreadcrumbItem[];
    accessLayers: AccessSettingLayer = new AccessSettingLayer(
        ControlLayer.Signing,
        [ControlLayer.Library, ControlLayer.Transaction, ControlLayer.Signing]
    );
    switchSetting: SwitchSetting;
    documentInfo: DocumentInfo;
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
        private _signingFormService: SigningFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _formLibraryControlsSettingService: FormLibraryControlsSettingService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _signingFormDesignPage: SigningFormDesignPage,
        private _router: Router,
        private _controlCopySettingService: ControlCopySettingService,
        private _pageControlService: PageControlService,
        public _zone: NgZone,
        private _controlDetailsService: ControlDetailsService,
        private _signingFormDesignReloadService: SigningFormDesignReloadService,
        private _signingReportService: SigningReportService,
        private _pageLinesService: PageLinesService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._initDocument();
        this._getCopyControls();
        this._getCopyMultipleControls();
        this._getCopySetting();
    }

    ngAfterViewInit(): void {
        this._getLoadingChange();
        this._registerToEvents();
    }

    ngOnDestroy(): void {
        this._unsubscribeFromEvents();
        this._pageControlService.setReloadMode(true);
    }

    public saveForm(getSummary: boolean): void {
        this.loading = true;

        const input = new UpdateSigningFormInput();
        input.id = this.signing.id;
        input.forms = this.signing.forms.map((form) => {
            return this._formLibraryDocumentHelper.mapFormDto(form);
        });
        this._signingFormService.update(input)
            .pipe(finalize(() => {
                this.loading = false;
                this._pageLinesService.movedControl = false;
            }))
            .subscribe(() => {
                this._removeMultiSelect();
                this.notify.success(this.l('SuccessfullySaved'));
                this._loadFormDocument();

                if (getSummary) {
                    this.submitSigningModal.show(this.signing.name);
                }
                this._cdr.markForCheck();
            });
    }

    private _getCopySetting(): void {
        this._controlCopySettingService.getCopyControlSettings$()
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe((result: CopyControlSettings) => {
                const copyControls: ControlEditDto[] = this._controlCopySettingService.setPositionControls(result, ControlLayer.Signing);
                this._copyControlsToPages(result, copyControls);

                this.saveForm(false);
                this._cdr.markForCheck();
            });
    }

    private _copyControlsToPages(setting: CopyControlSettings, controls: ControlEditDto[]): void {
        this.signing.forms.forEach((form: FormEditDto) => {
            const findDocument = setting.documentsPages.find((document: DocumentsPages) => {
                return form.id === document.documentId;
            });

            if (findDocument) {
                const findPage: ActionsFormItem = findDocument.pages.find((item: ActionsFormItem) => {
                    return item.isSelected;
                });

                return this._addControls(findPage, form, controls);
            }
        });
    }

    private _addControls(findPage: ActionsFormItem, form: FormEditDto, controls: ControlEditDto[]): PageEditDto[] {
        if (!findPage) { return; }

        if (findPage.title.includes('All: (')) {
            return this._controlCopySettingService.addCopyControls(form, controls);
        } else {
            return this._controlCopySettingService.addRangeCopyControls(form, controls, findPage);
        }
    }

    private _removeMultiSelect(): void {
        this._multiSelectControlsService.multiControls = [];
    }

    private _getLoadingChange(): void {
        this._formLibraryReloadService.getLoadingChange$()
        .pipe(
            debounceTime(500),
            takeUntil(this.onDestroy$)
            )
            .subscribe((result: boolean) => {
                if (result) {
                    this.saveForm(false);
                }
                this._cdr.markForCheck();
            });
    }

    private _initDocument(): void {
        this._activatedRoute
            .params
            .pipe(
                takeUntil(this.onDestroy$)
            )
            .subscribe((params) => {
                this.signingId = params['signingId'];

                this.breadcrumbs = [
                    new BreadcrumbItem('signing', '/app/admin/signings/' + this.signingId)
                ];

                if (this.signingId) {
                    // console.log(2);

                    this._loadFormDocument();
                }
            });
    }

    private _loadFormDocument(): void {
        this.loading = true;

        this._signingFormService.getForEdit(this.signingId)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: SigningFormEditDto) => {
                this.signing = result;
                this.accessTypeItem = new AccessTypeItem(
                    AccessSettingType.SigningFormDesign, this.signing.id
                );
                if (!this.switchSetting) {
                    this._getSetting(this.signing.forms);
                }
                this._setDocumentInfo();
                this.breadcrumbs = [
                    new BreadcrumbItem(this.signing.name, '/app/admin/signings/' + this.signingId),
                ];
                this._controlDetailsService.setIsControlSelected(false);
                this._cdr.markForCheck();
            });
    }

    private _setDocumentInfo(): void {
        this.documentInfo = new DocumentInfo(this.signing.name);
        this.signing.forms.forEach((form: FormEditDto) => {
            let pages: PageInfo[] = [];
            form.pages.forEach((page: PageEditDto) => {
                pages.push(
                    new PageInfo(
                        pages.length + 1,
                        page.id,
                    )
                );
            });
            const documentItem = new DocumentInfoItem(
                form.name,
                pages,
                form.id,
            );
            this.documentInfo.documents.push(documentItem);
        });
    }

    onSubmit() {
        this._router.navigate(['app/admin/signings', this.signingId]);
    }

    private _getSetting(document: FormEditDto[]): void {
        this._formLibraryControlsSettingService.isSigning = true;
        this.switchSetting = this._formLibraryControlsSettingService.getSetting(document);
    }

    private _getCopyControls(): void {
        this._signingFormDesignPage.getCopyControls$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: MultipleCopyControl) => {
                this._copyControl(result, result.pageId);
                this._cdr.markForCheck();
            });
    }

    private _copyControl(input: MultipleCopyControl | ControlEditDto, pageId: string): void {
        let copyControl: ControlEditDto;
        if (input instanceof ControlEditDto) {
            copyControl = input;
        } else if (input instanceof MultipleCopyControl) {
            copyControl = input.control;
        }
        this.signing.forms.forEach((form: FormEditDto) => {
            form.pages.forEach((page: PageEditDto, index: number) => {
                copyControl.id = `Temp-index_${page.controls.length}_${index}_${this._multiSelectControlsService.multiControls.length
                    }_${page.id}`;
                copyControl.layer = ControlLayer.Signing;

                if (page.id !== pageId) {
                    copyControl.id = copyControl.id + '_' + page.controls.length;
                    page.controls.push(cloneDeep(copyControl));
                    this._cdr.detectChanges();
                }
            });
        });
        this._signingFormDesignPage.setReloadCopyControl(true);
    }

    private _getCopyMultipleControls(): void {
        this._signingFormDesignPage.getCopyMultipleControls$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: MultipleCopyControl) => {
                this._multiSelectControlsService.multiControls.forEach((control) => {
                    this._copyControl(control, result.pageId);
                });
                this._removeMultiSelect();
            });
    }

    private _registerToEvents(): void {
        abp.event.on('app.document.notification.received', this._documentUpdatedReceived);
    }

    private _unsubscribeFromEvents(): void {
        abp.event.off('app.document.notification.received', this._documentUpdatedReceived);
    }

    private _documentUpdatedReceived = (notification: DocumentNotification) => {
        if (notification.parentId === this.signingId) {
            this._getBackgroundImage();
        }
    }

    private _getBackgroundImage(): void {
        this._signingFormService.getForEdit(this.signingId)
            .pipe(delay(0))
            .subscribe((result: SigningFormEditDto) => {
                this._setNewPageBackground(result);
                this._signingFormDesignReloadService.setReloadBackground(true);
                this._cdr.markForCheck();
            });
    }

    private _setNewPageBackground(newSigning: SigningFormEditDto): void {
        this.signing.forms.forEach((form, formIndex) => {
            form.pages.forEach((page, pageIndex) => {
                page.fileId = newSigning.forms[formIndex].pages[pageIndex].fileId;
            });
        });
    }

    generateReport() {
        this._signingReportService.downloadReport(this.signing.id, this.signing.name, () => {
            //finish report generation
        });
    }
}
