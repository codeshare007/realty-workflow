import { ChangeDetectorRef, Component, HostBinding, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormLibraryDocumentHelperService } from '@app/admin/forms-library/form-library-document/services/form-library-document-helper.service';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { PageControlService } from '@app/shared/components/forms-library/form-library-document/components/document-view/document-page/page-control/components/services/page-control.service';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { AccessSettingLayer, AccessSettingType, AccessTypeItem, IBoxPosition, SwitchSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { PageLinePipe } from '@app/shared/components/forms-library/pipes/page-line.pipe';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { FormLibraryControlsSettingService } from '@app/shared/components/forms-library/services/form-library-controls-setting.service';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { PageLinesService } from '@app/shared/components/forms-library/services/page-lines.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer, FormEditDto, TransactionFormEditDto, TransactionFormServiceProxy, UpdateTransactionFormInput } from '@shared/service-proxies/service-proxies';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { TransactionFormReportService } from '../transaction-form-report.service';

@Component({
    templateUrl: './transaction-form-design-page.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, PageLinePipe, FormLibraryControlsSettingService],
})
export class TransactionFormDesignComponent extends AppComponentBase implements OnInit, OnDestroy {

    @HostBinding('class.form-library-document') class = true;

    transactionId: string;
    transactionFormId: string;
    transactionForm: TransactionFormEditDto;
    accessLayers: AccessSettingLayer = new AccessSettingLayer(ControlLayer.Transaction, [ControlLayer.Transaction, ControlLayer.Library]);
    loading = false;
    breadcrumbs: BreadcrumbItem[];
    switchSetting: SwitchSetting;
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
        private _transactionFormService: TransactionFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _formLibraryControlsSettingService: FormLibraryControlsSettingService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _pageControlService: PageControlService,
        private _controlDetailsService: ControlDetailsService,
        private _pageLinePipe: PageLinePipe,
        private _transactionFormReportService: TransactionFormReportService,
        private _pageLinesService: PageLinesService,
        // public transactionFormSettingService: TransactionFormSettingService,
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

        const input = new UpdateTransactionFormInput();
        input.id = this.transactionForm.id;
        input.form = this._formLibraryDocumentHelper.mapFormDto(this.transactionForm.form);

        this._transactionFormService.update(input)
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
                this.transactionId = params['transactionId'];
                this.transactionFormId = params['id'];

                this.breadcrumbs = [
                    new BreadcrumbItem('Transaction', '/app/admin/transactions/' + this.transactionId + '/forms')
                ];

                if (this.transactionFormId) {
                    this._loadFormDocument();
                }
            });
    }

    private _loadFormDocument(): void {
        this.loading = true;

        this._transactionFormService.getForEdit(this.transactionFormId, undefined)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: TransactionFormEditDto) => {
                this.transactionForm = result;
                this.accessTypeItem = new AccessTypeItem(
                    AccessSettingType.TransactionFormDesign, this.transactionForm.id
                );
                this._pageLinePipe.transform([this.transactionForm.form]);
                this._getSetting(this.transactionForm.form);
                this.breadcrumbs = [
                    new BreadcrumbItem('Transaction', '/app/admin/transactions/' + this.transactionId + '/forms'),
                    new BreadcrumbItem(this.transactionForm.name),
                ];
                this._controlDetailsService.setIsControlSelected(false);
            });
    }

    private _getSetting(document: FormEditDto): void {
        this._formLibraryControlsSettingService.isTransaction = true;
        this.switchSetting = this._formLibraryControlsSettingService.getSetting(document);
    }

    generateReport() {
        this._transactionFormReportService.downloadReport(this.transactionId, this.transactionFormId, this.transactionForm.name, () => {
            //finish report generation
        });
    }
}
