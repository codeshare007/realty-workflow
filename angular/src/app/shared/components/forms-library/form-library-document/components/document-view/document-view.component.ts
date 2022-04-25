import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { SigningFormDesignPage } from '@app/admin/signings/signing-form-design/services/signing-form-design-page.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlLayer, FormEditDto, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';
import { clone, isNumber, isUndefined } from 'lodash';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AccessSettingLayer, AccessTypeItem, ISignatureInput, SwitchSetting } from '../../../models/table-documents.model';
import { FormUrlService } from '../../../services/http/form-url.service';
import { MultiSelectControlsService } from '../../../services/multi-select-controls.service';
import { ParticipantSettingService } from '../form-controls/services/participant-setting.service';
import { MatSignatureControlModalComponent } from './document-page/page-control/components/signature-control/modal/mat-modal/mat-signature-control-modal.component';
import { UploadAttachmentModalComponent } from './document-page/page-control/components/signature-control/modal/upload-attachment/upload-attachment-modal.component';
import { SignatureControlService } from './document-page/page-control/components/signature-control/services/signature-control.service';
import { DocumentViewService } from './services/document-view.service';

@Component({
    selector: 'document-view',
    templateUrl: './document-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent extends AppComponentBase implements OnInit, OnChanges, AfterViewInit {

    @HostBinding('class.document-view') class = true;

    // @ViewChild('signatureControlRef')
    // signatureControlModal: SignatureControlModalComponent;
    // @ViewChild('matSignatureControlRef')
    // matSignatureControlModal: MatSignatureControlModalComponent;
    @ViewChild('uploadAttachmentRef')
    uploadAttachmentModal: UploadAttachmentModalComponent;

    @Input() document: FormEditDto;
    @Input() publicMode = false;
    @Input() adminView = false;
    @Input() participantId: string;
    @Input() participants: ContactListDto[];
    @Input() accessSetting: AccessSettingLayer;
    @Input() accessTypeItem: AccessTypeItem;
    @Input() mainLayer: ControlLayer;
    @Input() switchSetting: SwitchSetting = new SwitchSetting();
    @Input() participantMappingItems: ParticipantMappingItemDto[];

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _documentViewService: DocumentViewService,
        private _signatureControlService: SignatureControlService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _signingFormDesignPage: SigningFormDesignPage,
        private _formUrlService: FormUrlService,
        private _participantSettingService: ParticipantSettingService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _matDialog: MatDialog,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.switchSetting
            && (this._documentViewService.formSetting
                && isUndefined(this._documentViewService.formSetting.viewModeSettings))
        ) {
            this._documentViewService.formSetting = clone(this.switchSetting);
        }

        if (changes.participants) {
            this._setDefaultParticipant();
        }

        if (changes.accessTypeItem) {
            this._formUrlService.accessTypeItem = this.accessTypeItem;
        }

        this._getParticipantsChange();
    }

    ngOnInit(): void {
        this._getSignatureStateChange();
        this._getUploadAttachmentChange();
        this._onDeleteMultiControl();
    }

    public onControlDropped(): void {
        this._formLibraryReloadService.setLoadingChange(true);
    }

    public onModalSave(event?: boolean): void {
        this._formLibraryReloadService.setLoadingChange(true);
    }

    private _onDeleteMultiControl(): void {
        this._multiSelectControlsService.getDeleteMultiControl$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((mainLayer: ControlLayer) => {
                if (isNumber(mainLayer)) {
                    this.document.pages.forEach((page) => {
                        page.controls = page.controls.filter((control) => {
                            const find = this._multiSelectControlsService.multiControls
                                .find((item) => {
                                    return mainLayer === item.layer && item.id === control.id;
                                });
                            return find ? false : true;
                        });
                    });
                    if (mainLayer === ControlLayer.Signing) {
                        this._signingFormDesignPage.setReloadCopyControl(true);
                    }
                }
            });
    }

    private _getSignatureStateChange(): void {
        this._signatureControlService.getSignatureStateChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: ISignatureInput) => {
                if (result) {
                    // this.signatureControlModal.show(result);
                    if (!this._documentViewService.signingModalOn) {
                        this._documentViewService.signingModalOn = true;
                        const dialogRef = this._matDialog.open(MatSignatureControlModalComponent, {
                            data: result
                        });
                        dialogRef.afterClosed()
                            .subscribe((result) => {
                                this._documentViewService.signingModalOn = false;
                                if (result && result.event) {
                                    this.onModalSave();
                                    return;
                                }
                            });
                        this._cdr.markForCheck();
                    }
                }
            });
    }

    private _getUploadAttachmentChange(): void {
        this._signatureControlService.getUploadAttachmentChange$()
            .pipe(
                debounceTime(300),
                takeUntil(this.onDestroy$)
            )
            .subscribe((result: ISignatureInput) => {
                if (result) {
                    this.uploadAttachmentModal.show(result);
                    this._cdr.markForCheck();
                }
            });
    }

    private _setDefaultParticipant(): void {
        const defaultParticipant = new ContactListDto();
        defaultParticipant.firstName = 'Unassigned';
        defaultParticipant.middleName = '';
        defaultParticipant.lastName = '';
        defaultParticipant.id = 'default';
        setTimeout(() => {
            const find = this.participants.find((item) => {
                return item.id === defaultParticipant.id;
            });
            if (!find) {
                this.participants.push(defaultParticipant);
                this._cdr.detectChanges();
            }
        });
    }

    private _getParticipantsChange(): void {
        // Chnage participantMappingItems afte update in participant setting component
        this._participantSettingService.getParticipantsChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                this.participantMappingItems = result;
            });
    }
}
