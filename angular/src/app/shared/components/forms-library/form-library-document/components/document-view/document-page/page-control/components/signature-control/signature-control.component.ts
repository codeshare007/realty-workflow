import { ChangeDetectorRef, Component, ElementRef, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormLibraryReloadService } from '@app/admin/forms-library/form-library-document/services/form-library-reload.service';
import { ControlValueInput, ISignatureInput, SignatureJsonValue, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlType, DownloadSigningAttachmentInput, EntityDtoOfGuid, FileDto, SigningServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { get, isEmpty } from 'lodash';
import { delay, takeUntil } from 'rxjs/operators';
import { SigningInitialService } from 'signing/services/signing-initial.service';
import { SigningSignatureService } from 'signing/services/signing-signature.service';
import { SigningService } from 'signing/services/signing.service';
import { ControlDetailsService } from '../../../../../form-controls/services/control-details.service';
import { SignatureControlService } from './services/signature-control.service';

@Component({
    selector: 'signature-control',
    templateUrl: './signature-control.component.html',
})
export class SignatureControlComponent extends AppComponentBase implements OnChanges, OnInit {

    @HostBinding('class.signature-control') class = true;

    @ViewChild('signature') signatureRef: ElementRef;

    @Input() control: ControlEditDto;
    @Input() participants: ContactListDto[] = [];
    @Input() pageId: string;
    @Input() documentId: string;
    @Input() participantId: string;
    @Input() publicMode: boolean;
    @Input() tabIndex: number;

    jsonObject: SignatureJsonValue = new SignatureJsonValue();
    readonly controlType = ControlType;

    get styleControl(): Object {
        return {
            'width.px': this.control.size.width,
            'height.px': this.control.size.height,
        };
    }

    get isPublicSigning(): boolean {
        return get(this.control, ['value', 'value']) && !this._isAtachedControl()
            ? JSON.parse(this.control.value.value).data === (this.isTwoSymbol()
                ? this._signingInitialService.initial
                : this._signingSignatureService.signature)
            : false;
    }

    get isInitialFilled(): boolean {
        return get(this.control, ['value', 'value']) && !this._isAtachedControl()
            ? JSON.parse(this.control.value.value).data === this._signingInitialService.initial
            : false;
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _signatureControlService: SignatureControlService,
        private _signingSignatureService: SigningSignatureService,
        private _signingService: SigningService,
        private _formLibraryReloadService: FormLibraryReloadService,
        private _controlDetailsService: ControlDetailsService,
        private _signingInitialService: SigningInitialService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
        private _signingServiceProxy: SigningServiceProxy,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control && this.isControl() && !this._isAtachedControl()) {
            const json = JSON.parse(this.control.value.value);
            this.jsonObject = new SignatureJsonValue(json.data, json.accept, json.decline);
        }

        if (changes.control && this.isControl() && this.isPublicNotInited() && !this._isAtachedControl()) {
            this._initPublicSigning();
        }

        if (this._isAtachedControl()) {

        }
    }

    ngOnInit(): void {
        if (this.publicMode) {
            this._setFocusControl();
        }
    }

    public deleteAttachment(): void {
        this._deleteAttachmen();
    }

    public apruvePermissions(): void {
        this.jsonObject.accept = true;
        this.jsonObject.decline = false;
        this._saveSignature(true);
    }

    public cancelPermissions(): void {
        this.jsonObject.decline = true;
        this.jsonObject.accept = false;
        this._saveSignature(true);
    }

    public isBase64(): boolean {
        const controlValue = get(this.control, ['value', 'value']);

        if (controlValue && !this._isAtachedControl()) {
            const json = JSON.parse(controlValue);
            return json.data ? json.data.includes('data:image/png;base64') : false;
        }
    }

    public isControl(): boolean {
        return !isEmpty(get(this.control, ['value', 'value']));
    }

    public onModalShow(): void {
        if (!this.publicMode) { return; }

        const input = new ISignatureInput(
            this.control, this.documentId,
            this.pageId, this.participantId
        );

        if (this.control.type === ControlType.UploadAttachment) {
            if (get(this.control, ['value', 'value'])) {
                return;
            } else {
                this._signatureControlService.setUploadAttachmentChange(input);
            }

            return;
        }

        if (this.isPublicNotInited() || get(this.control, ['value', 'value'])) {
            this._signatureControlService.setSignatureStateChange(input);
        } else if (!this.isPublicSigning) {
            this._saveSignature();
        }
    }

    private _isAtachedControl(): boolean {
        return this.control.type === ControlType.UploadAttachment;
    }

    public isAtachedControlClass(): boolean {
        return this._isAtachedControl() && this.isControl();
    }

    public dounloadAttached(): void {
        const input = new DownloadSigningAttachmentInput();
        const attachment = new EntityDtoOfGuid();
        attachment.id = this.control.value.value;
        input.id = this._formUrlService.accessTypeItem.publicId;
        input.attachment = attachment;
        this._signingServiceProxy.downloadAttachment(input)
            .subscribe((result: FileDto) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    private _setFocusControl(): void {
        this._signingService.getTabChange$()
            .pipe(
                delay(300),
                takeUntil(this.onDestroy$)
            ).subscribe((type: TypeIndex) => {
                if (this.tabIndex === (this._signingService.focusStartedControl)) {
                    this.signatureRef.nativeElement.focus();
                    this.signatureRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    this._controlDetailsService.selectControlDetails(this.control);
                    this._cdr.markForCheck();
                }
            });
    }

    private isPublicNotInited(): boolean {
        return this.isTwoSymbol()
            ? !this._signingInitialService.isInitialInited()
            : !this._signingSignatureService.isSignatureInited();
    }

    private _initPublicSigning(): void {
        if (this.isTwoSymbol()) {
            this._signingInitialService.initial = this.jsonObject.data;
        } else {
            this._signingSignatureService.signature = this.jsonObject.data;
        }
    }

    private _saveSignature(isSetting?: boolean): void {
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = this.control.id;
        input.pageId = this.pageId;
        input.formId = this.documentId;
        input.value = this._setControlValue(isSetting);

        this._httpService.post(this._formUrlService.controlUrl, input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                this._formLibraryReloadService.setLoadingChange(true);
                this._setFilledProgress();
            });
    }

    private _deleteAttachmen(): void {
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = this.control.id;
        input.pageId = this.pageId;
        input.formId = this.documentId;
        input.value = undefined;

        this._httpService.post(this._formUrlService.controlUrl, input)
            .subscribe(() => {
                this.control.value.value = undefined;
                this.notify.success(this.l('SuccessfullySaved'));
                this._setFilledProgress();
                this._cdr.markForCheck();
            });
    }

    public isTwoSymbol(): boolean {
        const controlType = get(this.control, 'type');

        return controlType === ControlType.Initials
            || controlType === ControlType.OptionalInitials;
    }

    private _setControlValue(isSetting: boolean): string {
        if (isSetting) {
            const value = JSON.parse(this.control.value.value).data;

            return this._setJsonObject(value);
        }

        return this.isTwoSymbol()
            ? this._setJsonObject(this._signingInitialService.initial)
            : this._setJsonObject(this._signingSignatureService.signature);
    }

    private _setJsonObject(value: string): string {
        const { accept, decline } = this.jsonObject;

        return JSON.stringify(
            new SignatureJsonValue(
                value, accept, decline
            )
        );
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.control, this.participantId);
    }
}
