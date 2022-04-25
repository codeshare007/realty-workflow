import { ChangeDetectorRef, Component, HostBinding, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormLibraryDocumentHelperService } from '@app/admin/forms-library/form-library-document/services/form-library-document-helper.service';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { PageControlService } from '@app/shared/components/forms-library/form-library-document/components/document-view/document-page/page-control/components/services/page-control.service';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { AccessSettingLayer, DocumentInfo, DocumentInfoItem, IBoxPosition, PageInfo, SwitchSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { FormLibraryControlsSettingService } from '@app/shared/components/forms-library/services/form-library-controls-setting.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer, FormEditDto, PageEditDto, SigningFormEditDto, SigningFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { SigningReportService } from '../signings-report.service';

@Component({
    templateUrl: './signing-form-view-page.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, FormLibraryControlsSettingService],
})
export class SigningFormViewComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.form-library-document') class = true;

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
        private _formLibraryControlsSettingService: FormLibraryControlsSettingService,
        private _pageControlService: PageControlService,
        private _controlDetailsService: ControlDetailsService,
        private _signingReportService: SigningReportService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._initDocument();
    }

    ngOnDestroy(): void {
        this._pageControlService.setReloadMode(true);
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

    private _getSetting(document: FormEditDto[]): void {
        this._formLibraryControlsSettingService.isSigning = true;
        this.switchSetting = this._formLibraryControlsSettingService.getSetting(document);
    }
    
    generateReport() {
        this._signingReportService.downloadReport(this.signing.id, this.signing.name, () => {
            //finish report generation
        });
    }
}
