import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from '@app/shared/common/sub-header/sub-header.component';
import { UpdateFormListenerService } from '@app/shared/services/update-form-listener.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    AddFromLibraryInput, AddTransactionFromInput, DownloadFinalDocumentInput, EntityDtoOfGuid, ExpirationSettingsDto,
    LibraryServiceProxy, ReminderSettingsDto, ResetSigningInput, SigningEditDto, SigningFormServiceProxy,
    SigningServiceProxy, SigningSettingsDto, SigningStatus
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { isUndefined } from 'lodash';
import { filter } from 'rxjs/internal/operators/filter';
import { delay, takeUntil } from 'rxjs/operators';
import { DuplicateSigningModalComponent } from '../duplicate-signing-modal/duplicate-signing-modal.component';
import { SigningFormsTableComponent } from '../signing-forms-section/signing-forms-table/signing-forms-table.component';

@Component({
    templateUrl: './signing-page.component.html',
    styleUrls: ['./signing-page.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()],
    providers: [
        UpdateFormListenerService,
    ],
})
export class SigningPageComponent extends AppComponentBase implements OnInit {

    @ViewChild('signingFormsTable') signingFormsTable: SigningFormsTableComponent;
    @ViewChild('duplicateSigningModal', { static: true }) duplicateSigningModal: DuplicateSigningModalComponent;

    signing: SigningEditDto = new SigningEditDto();
    transactionId: string;
    transactionAddress: string;
    isEditMode = false;
    libraryId: string;
    breadcrumbs: BreadcrumbItem[];
    accordionOptions = {
        participantsOpened: true,
        documentsOpened: true,
    };
    get signingStatus() {
        return SigningStatus;
    }

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _libraryService: LibraryServiceProxy,
        private _signingFormService: SigningFormServiceProxy,
        private _signingServiceProxy: SigningServiceProxy,
        private _fileDownloadService: FileDownloadService,
        public updateFormListenerService: UpdateFormListenerService,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._activatedRoute
            .params
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                this.transactionId = result.transactionId;
                this.transactionAddress = result.address;
                if (!isUndefined(result.id)) {
                    this._setSigning(result.id);

                    return;
                }

                this.signing.name = this.transactionAddress;
                this.signing.transaction = this.transactionAddress;
            });

        this._setForCreateSigning();
        this._getLibraries();
        this._isLoadingChange();
    }

    public resetSigning(): void {
        this.message.confirm(
            this.l('RejectWarningMessage'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    const input = new ResetSigningInput();
                    input.id = this.signing.id;

                    this._signingServiceProxy.resetSigning(input).subscribe(newSigningId => {
                        this._router.navigate(['/app/admin/signings', newSigningId]);
                        this.notify.success(this.l('SuccessfullyRejected'));
                    });
                }
            }
        );
    }

    public addFromLibraries(formLibraryIds: string[]): void {
        formLibraryIds.forEach((formLibraryId: string) => {
            this.addFromLibrary(formLibraryId);
        });
    }

    public addFromLibrary(formLibraryId: string): void {
        const input = new AddFromLibraryInput({
            id: this.signing.id,
            form: new EntityDtoOfGuid({
                id: formLibraryId
            })
        });
        this.updateFormListenerService.isLoading = true;
        this._signingFormService.addFromLibrary(input)
            .pipe(delay(0))
            .subscribe((result: string) => {
                this.updateFormListenerService.setDebounceCheckUpdate(true);
                this.signingFormsTable.reload(undefined);
                this.notify.success(this.l('SuccessfullySaved'));
            });
    }

    public addTransactionForms(transactionFormIds: string[]): void {
        transactionFormIds.forEach((transactionFormId: string) => {
            this.addTransactionForm(transactionFormId, this.signing.transactionId);
        });
    }

    public addTransactionForm(transactionFormId: string, transactionId: string): void {
        const input = new AddTransactionFromInput({
            id: this.signing.id,
            transactionId: transactionId,
            form: new EntityDtoOfGuid({
                id: transactionFormId
            })
        });
        this.updateFormListenerService.isLoading = true;
        this._signingFormService.addTransactionFrom(input)
            .pipe(delay(0))
            .subscribe((result: string) => {
                this.updateFormListenerService.setDebounceCheckUpdate(true);
                this.signingFormsTable.reload(undefined);
                this.notify.success(this.l('SuccessfullySaved'));
            });
    }

    public downloadReport(): void {
        const input = new DownloadFinalDocumentInput({
            id: this.signing.id,
        });

        this._signingServiceProxy.downloadFinalDocument(input)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    public duplicateSigning(): void {
        this.duplicateSigningModal.show(this.signing.id, this.signing.name, false);
    }

    public duplicateForNextSigning(): void {
        this.duplicateSigningModal.show(this.signing.id, this.signing.name, true);
    }

    private _isLoadingChange(): void {
        this.updateFormListenerService.getDebounceCheckUpdate$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                this.updateFormListenerService.isLoading = false;
            });
    }

    private _setForCreateSigning(): void {
        this._activatedRoute.data
            .pipe(
                filter(data => data.isCreate),
                takeUntil(this.onDestroy$)
            )
            .subscribe((result) => {
                if (result.isCreate) {
                    this.signing = new SigningEditDto({
                        name: this.transactionAddress || '',
                        notes: '',
                        agent: this.appSession.user.name + ' ' + this.appSession.user.surname,
                        status: SigningStatus.Wizard,
                        agentId: this.appSession.user.publicId,
                        transaction: this.transactionAddress,
                        transactionId: this.transactionId,
                        documentsCount: 0,
                        signedFileGenerated: false,
                        id: undefined,
                        settings: new SigningSettingsDto()
                    });
                    this.signing.settings.expirationSettings = new ExpirationSettingsDto();
                    this.signing.settings.reminderSettings = new ReminderSettingsDto();
                    if (this.transactionId) {
                        this.breadcrumbs = [
                            new BreadcrumbItem(
                                'Transaction: ' + this.signing.transaction,
                                'app/admin/transactions/' + this.signing.transactionId + '/signings'
                            ),
                            new BreadcrumbItem('Signing: ' + this.signing.name)];
                    }

                    this.isEditMode = true;
                }
            });
    }

    private _getLibraries(): void {
        this._libraryService.getAll(undefined, undefined, 100, 0)
            .subscribe(result => {
                if (result.items.length) {
                    this.libraryId = result.items[0].id;
                } else {
                    this.libraryId = undefined;
                }
            });
    }

    private _setSigning(id: string): void {
        this._signingServiceProxy.getForEdit(id)
            .subscribe((signingEdit: SigningEditDto) => {
                const breadcrumbsItems = [];
                this.signing = signingEdit;
                if (this.signing.transactionId) {
                    breadcrumbsItems.push(
                        new BreadcrumbItem(
                            'Transaction: ' + this.signing.transaction,
                            'app/admin/transactions/' + this.signing.transactionId + '/signings'
                        )
                    );
                }
                breadcrumbsItems.push(
                    new BreadcrumbItem('Signing: ' + this.signing.name)
                );
                this.breadcrumbs = breadcrumbsItems;
            });
    }
}
