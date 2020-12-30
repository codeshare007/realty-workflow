import { ChangeDetectorRef, Component, HostBinding, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormLibraryDocumentHelperService } from '@app/admin/forms-library/form-library-document/services/form-library-document-helper.service';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { IBoxPosition, IDragDropEvent } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TransactionFormEditDto, TransactionFormServiceProxy, UpdateTransactionFormInput } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { TransactionFormSettingService } from './services/form-library-document-setting.service';

@Component({
    templateUrl: './transaction-form-design-page.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, TransactionFormSettingService],
})
export class TransactionFormDesignComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.form-library-document') class = true;

    transactionId: string;
    transactionFormId: string;
    transactionForm: TransactionFormEditDto;

    loading = false;
    breadcrumbs: BreadcrumbItem[];

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
        private _cdk: ChangeDetectorRef,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _dndService: DndService,
        private _transactionFormService: TransactionFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        public transactionFormSettingService: TransactionFormSettingService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._initDocument();
        this._formLibraryReloadService.getLoadingChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                if (result) {
                    this.saveForm();
                }
                this._cdk.markForCheck();
            });
    }

    public onFormDropped(event: IDragDropEvent): void {
        console.log('control: ', event);
    }

    public saveForm(): void {
        this.loading = true;

        const input = new UpdateTransactionFormInput();
        input.id = this.transactionForm.id;
        input.form = this._formLibraryDocumentHelper.mapFormDto(this.transactionForm.form);

        this._transactionFormService.update(input)
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                this._loadFormDocument();
            });
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

                this.breadcrumbs = [
                    new BreadcrumbItem('Transaction', '/app/admin/transactions/' + this.transactionId + '/forms'),
                    new BreadcrumbItem(this.transactionForm.name),
                ];
            });
    }
}
