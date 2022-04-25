import { ChangeDetectorRef, Component, HostBinding, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { ControlDetailsService } from '@app/shared/components/forms-library/form-library-document/components/form-controls/services/control-details.service';
import { AccessSettingType, AccessTypeItem, SignatureJsonValue, SigningProgressItem, TabIndexControl, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CompleteSigningRequestInput, ControlEditDto, ControlType, FormEditDto, RejectSigningRequestInput, SigningFormDto, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { isEmpty, isNumber } from 'lodash';
import { delay, finalize, takeUntil } from 'rxjs/operators';
import { RejectModalComponent } from './modals/reject/reject-modal.component';
import { SigningService } from './services/signing.service';

@Component({
    templateUrl: './signing.component.html',
    animations: [accountModuleAnimation()],
})
export class SigningComponent extends AppComponentBase implements OnInit {

    @HostBinding('class.signing') class = true;

    @ViewChild('rejectModalRef') rejectModal: RejectModalComponent;

    loading = false;
    signing: SigningFormDto;
    accessTypeItem: AccessTypeItem = new AccessTypeItem();
    code: string;
    isActive = false;
    isInited = false;
    progressWidth = 0.1;
    isControlSelected = false;
    complitedControls: number;
    requiredControls: number;

    get progress(): number {
        return Math.floor(this.progressWidth);
    }
    get isPrevious(): boolean {
        return this.isArrowActive()
            && this._signingService.focusStartedControl > 1;
    }
    get isNext(): boolean {
        return this._signingService.focusStartedControl < this._signingService.tabIndexControls.length;
    }
    get isComplete(): boolean {
        return Math.round(this.progressWidth) === 100;
    }

    public constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _signingServiceProxy: SigningServiceProxy,
        private _signingService: SigningService,
        private _cdr: ChangeDetectorRef,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _controlDetailsService: ControlDetailsService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._activatedRoute.params
            .pipe(
                takeUntil(this.onDestroy$),
            ).subscribe((params) => {
                this.code = params['code'];
                this._signingService.code = this.code;
                this._getForSignin(this.code);

            });
        this._getProgressChange();
        this._getLoadingChange();
        this._getIsControlSelected();

        setTimeout(() => {
            this._focusFirstRequired();
        }, 1000)
    }

    public showActions(): boolean {
        return this._signingService.tabIndexControls.length >= 1;
    }

    public showProgress(): boolean {
        return this._signingService.signingProgresList && this._signingService.signingProgresList.length >= 1;
    }

    public onPrevious(): void {
        this._signingService.focusStartedControl = this._signingService.focusStartedControl - 1;
        this._signingService.setTabChange(TypeIndex.Saving);
        this._cdr.detectChanges();
    }

    public onNext(): void {
        this._signingService.focusStartedControl = this._signingService.focusStartedControl + 1;
        this._signingService.setTabChange(TypeIndex.Saving);
        this._cdr.detectChanges();
    }

    public onComplete(): void {
        if (!this.isComplete) {
            this.message.info(undefined, this.l('FormNotCompleted'))
                .then((result) => {
                    if (result.isConfirmed) {
                        this._focusFirstRequired();
                        this._cdr.markForCheck();
                    }
                });

            return;
        }

        this.message.confirm(
            'Signing will be completed',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    const input = new CompleteSigningRequestInput();
                    input.c = this.code;
                    this.loading = true;
                    this._signingServiceProxy.completeSigningRequest(input)
                        .pipe(finalize(() => {
                            this.loading = false;
                            setTimeout(() => {
                                this._router.navigate(['signing-done']);
                            }, 1000);
                        }))
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullySaved'));
                        });
                } else {
                    // TODO: DO something
                    console.log('cancel: ', isConfirmed);
                }
            }
        );
    }

    private _focusFirstRequired(): void {
        this._signingService.setTabChange(TypeIndex.Saving);
        this._signingService.focusFirstRequired();
        this._cdr.detectChanges();
    }

    public onShowReject(): void {
        this.rejectModal.show();
    }

    public onReject(comment: string): void {
        this.message.confirm(
            'Signing will be rejected',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    const input: RejectSigningRequestInput = new RejectSigningRequestInput();
                    input.c = this.code;
                    input.id = this.signing.id;
                    input.comment = comment;
                    this.loading = true;
                    this._signingServiceProxy.rejectSigningRequest(input)
                        .pipe(finalize(() => this.loading = false))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._router.navigate(['signing-rejected']);
                            }, 1000);
                            this.notify.success(this.l('SuccessfullyRejected'));
                        });
                }
            });
    }

    public getTopPosition(): string {
        const controlSetting: TabIndexControl = this._signingService.getArrowPosition();
        const pageHeight = 1754; // AppConst.heightPageDragDrop
        let emptySpace = 0;
        if (!isEmpty(controlSetting)) {
            const pageOrder = (controlSetting.pageOrder > 1 ? controlSetting.pageOrder - 1 : 0);
            emptySpace += controlSetting.pageOrder > 1 ? 29.5 : 0;
            const bufferPage = pageHeight * pageOrder + emptySpace * pageOrder;

            return controlSetting.top + bufferPage + (controlSetting.height / 2) + 'px';
        }
    }

    public isArrowActive(): boolean {
        return Math.floor(this._signingService.focusStartedControl) <= Math.floor(this.requiredControls);
    }

    private _getIsControlSelected(): void {
        this._controlDetailsService.getIsControlSelected$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                this.isControlSelected = result;
            });
    }

    private _getProgressChange(): void {
        this._signingService.getProgressChange$()
            .pipe(
                takeUntil(this.onDestroy$),
                delay(0)
            )
            .subscribe((result) => {
                if (result) {
                    this._setProgress();
                    this.complitedControls = this._signingService.signingProgresList
                        .filter((item) => item.isFilled).length;
                    this.requiredControls = this._signingService.signingProgresList.length;
                }
            });
    }

    private _getLoadingChange(): void {
        this._formLibraryReloadService.getLoadingChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                if (result) {
                    this._getForSignin(this.code);
                }
                this._cdr.markForCheck();
            });
    }

    private _getForSignin(id: string): void {
        this._signingServiceProxy.getForSigning(id, undefined)
            .subscribe((result: SigningFormDto) => {
                this.signing = result;
                this.accessTypeItem = new AccessTypeItem(
                    AccessSettingType.ParticipantCode, this.code, this.signing.id
                );
                this._signingService.signingProgresList = [];
                const participant = this.signing.participants
                    .find((participant) => {
                        return participant.id === this.signing.participantId;
                    });
                if (participant) {
                    this._signingService.participantInitials = participant.initials;
                    this._signingService.participantName = participant.fullName;
                }
                this._getControlsNumber(this.signing.forms);
                this._signingService.setTabIndexControls(this.signing.forms, this.signing.participantId);
                this.isActive = true;
                if (isNumber(this._signingService.focusStartedControl)) {
                    this._signingService.focusStartedControl++;
                    this._signingService.setTabChange(TypeIndex.Saving);
                }
            });
    }

    private _getControlsNumber(forms: FormEditDto[]): void {
        forms.forEach((document) => {
            document.pages.forEach((page) => {
                page.controls.forEach((control: ControlEditDto) => {
                    if (control.participantId === this.signing.participantId && control.isRequired) {
                        let jsonObject = new SignatureJsonValue();
                        if (this._isOptionalSign(control.type) && control.value) {
                            jsonObject = JSON.parse(control.value.value);
                        }
                        this._signingService.signingProgresList
                            .push(
                                new SigningProgressItem(
                                    control.id,
                                    this._isOptionalSign(control.type),
                                    jsonObject
                                )
                            );
                    }
                });
            });
        });
    }

    private _isOptionalSign(type: ControlType): boolean {
        return type === ControlType.OptionalInitials
            || type === ControlType.OptionalSigning;
    }

    private _setProgress(): void {
        this.progressWidth = this._signingService.getProgressWidth();
    }
}
