import { ChangeDetectorRef, Component, HostBinding, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormLibraryDocumentHelperService } from '@app/admin/forms-library/form-library-document/services/form-library-document-helper.service';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { IBoxPosition, IDragDropEvent } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SigningFormEditDto, SigningFormServiceProxy, UpdateSigningFormInput } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { SigningFormSettingService } from './services/form-library-document-setting.service';

@Component({
    templateUrl: './signing-form-design-page.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, SigningFormSettingService],
})
export class SigningFormDesignComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.form-library-document') class = true;

    signingId: string;
    signing: SigningFormEditDto;

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
        private _signingFormService: SigningFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        public signingFormSettingService: SigningFormSettingService,
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

        const input = new UpdateSigningFormInput();
        input.id = this.signing.id;
        input.forms = this.signing.forms.map(f => this._formLibraryDocumentHelper.mapFormDto(f));

        this._signingFormService.update(input)
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

                this.breadcrumbs = [
                    new BreadcrumbItem(this.signing.name, '/app/admin/signings/' + this.signingId),
                ];
            });
    }
}
