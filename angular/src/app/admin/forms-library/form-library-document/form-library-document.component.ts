import { ChangeDetectorRef, Component, HostBinding, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBoxPosition, IDragDropEvent } from '@app/shared/components/forms-library/models/table-documents.model';
import { DndService } from '@app/shared/components/forms-library/services/drag-drop.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LibraryFormEditDto, LibraryFormServiceProxy, UpdateLibraryFormInput } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormLibraryDocumentHelperService } from './services/form-library-document-helper.service';
import { FormLibraryDocumentSettingService } from './services/form-library-document-setting.service';
import { FormLibraryReloadService } from './services/form-library-reload.service';

@Component({
    templateUrl: './form-library-document.component.html',
    animations: [accountModuleAnimation()],
    providers: [FormLibraryDocumentHelperService, FormLibraryDocumentSettingService],
})
export class FormLibraryDocumentComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.form-library-document') class = true;

    libraryForm: LibraryFormEditDto;
    formId: string;

    loading = false;

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
        private _libraryFormService: LibraryFormServiceProxy,
        private _formLibraryDocumentHelper: FormLibraryDocumentHelperService,
        private _formLibraryReloadService: FormLibraryReloadService,
        public formLibraryDocumentSetting: FormLibraryDocumentSettingService,
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

        const input = new UpdateLibraryFormInput();
        input.id = this.libraryForm.id;
        input.form = this._formLibraryDocumentHelper.mapFormDto(this.libraryForm.form);

        this._libraryFormService.update(input)
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
            });
    }
}
