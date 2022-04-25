import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Injector, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ControlValueInput, ISignatureInput, SignatureJsonValue } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlType, ControlValueDto } from '@shared/service-proxies/service-proxies';
import { get } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { SigningInitialService } from 'signing/services/signing-initial.service';
import { SigningSignatureService } from 'signing/services/signing-signature.service';
import { SigningService } from 'signing/services/signing.service';
import { SignatureControlService } from '../services/signature-control.service';

// TODO: need delete modal and used MatSignatureControlModalComponent
@Component({
    selector: 'signature-control-modal',
    templateUrl: './signature-control-modal.component.html',
})
export class SignatureControlModalComponent extends AppComponentBase {

    @HostBinding('class.signature-control-modal') class = true;

    @ViewChild('signatureControlModal', { static: true }) modal: ModalDirective;
    @ViewChild(NgForm, { static: true }) photoForm: NgForm;
    @ViewChild('signaturePadRef', { static: false }) signaturePad: ElementRef;

    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    controlerInput: ISignatureInput;
    active = false;
    saving = false;
    context: CanvasRenderingContext2D;
    sigPadElement;
    isDrawing = false;
    initials = '';
    tabHeader = 'Draw';
    widthCanvas = 600;

    constructor(
        injector: Injector,
        private _signingService: SigningService,
        private _cdr: ChangeDetectorRef,
        private _signingSignatureService: SigningSignatureService,
        private _signingInitialService: SigningInitialService,
        private _signatureControlService: SignatureControlService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
    ) {
        super(injector);
    }

    public isBase64(): boolean {
        const controlValue = get(this.controlerInput, ['control', 'value', 'value']);
        if (controlValue) {
            const json = JSON.parse(controlValue);
            return controlValue ? json.data.includes('data:image/png;base64') : false;
        }
    }

    public isTwoSymbol(): boolean {
        const controlType = get(this.controlerInput, ['control', 'type']);

        return controlType === ControlType.Initials
            || controlType === ControlType.OptionalInitials;
    }

    public drawComplete(event: MouseEvent): void {
        this.isDrawing = false;
    }

    public drawStart(event: MouseEvent): void {
        this.isDrawing = true;
        const coords = this._relativeCoords(event);
        this.context.moveTo(coords.x, coords.y);
    }

    public drawProces(event: MouseEvent): void {
        if (this.isDrawing) {
            const coords = this._relativeCoords(event);
            this.context.lineTo(coords.x, coords.y);
            this.context.stroke();
        }
    }

    public drawClear(): void {
        this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
        this.context.beginPath();

    }

    public show(input: ISignatureInput): void {
        this.controlerInput = input;
        this.widthCanvas = this.controlerInput.control.type === ControlType.Signature
            || this.controlerInput.control.type === ControlType.OptionalSigning ? 600 : 252;
        this.tabHeader = this.isBase64() ? 'Draw' : 'Type';
        this.active = true;
        this._signingService.allowedChangeTab = false;
        this.modal.show();
        this.initials = this.controlerInput.control.type === ControlType.Signature
            || this.controlerInput.control.type === ControlType.OptionalSigning
            ? this._signingService.participantName
            : this._signingService.participantInitials;
    }

    public onShown(): void {
        this.sigPadElement = this.signaturePad.nativeElement;
        this.context = this.sigPadElement.getContext('2d');
        this.context.strokeStyle = '#3742fa';
        const controlValue = this.controlerInput.control.value
            ? this.controlerInput.control.value.value
            : undefined;
        if (controlValue) {
            const json = JSON.parse(controlValue);
            const value = json.data ? json.data : '';
            if (this.isBase64()) {
                const myImage = new Image();
                myImage.src = value;
                this.context.drawImage(myImage, 0, 0);
            } else {
                if (value) {
                    this.initials = value;
                }
            }
        }
    }

    public getCanvasClass(): string {
        return this.controlerInput.control.type === ControlType.Signature
            || this.controlerInput.control.type === ControlType.OptionalSigning
            ? ' canvas__signature'
            : ' canvas__initials';
    }

    public onActive(event: TabDirective): void {
        this.tabHeader = event.heading;
    }

    public onKeyPress(event): boolean {
        return this.isTwoSymbol()
            ? (this.initials && this.initials.split('.').join('').length < 2)
            && ((event.charCode > 64 && event.charCode < 91)
                || (event.charCode > 96 && event.charCode < 123))
            : true;
    }

    public onModalSave(event: boolean): void {
        console.log('event: ', event);
        this.close();
    }

    public close(): void {
        this.active = false;
        this.controlerInput = undefined;
        this.initials = undefined;
        this._signingService.allowedChangeTab = true;
        this.modal.hide();
    }

    public save() {
        this.controlerInput.control.value = new ControlValueDto();
        if (this.tabHeader === 'Draw') {
            const object = new SignatureJsonValue(this.sigPadElement.toDataURL('image/png'));
            this.controlerInput.control.value.value = JSON.stringify(object);
        } else {
            const value = this.isTwoSymbol()
                ? this.initials.length === 3
                    ? `${this.initials}.`
                    : this.initials
                : this.initials;
            const object = new SignatureJsonValue(value);
            this.controlerInput.control.value.value = JSON.stringify(object);

        }
        this._saveSignature();
    }

    private _saveSignature(): void {
        const { control, pageId, documentId } = this.controlerInput;
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = control.id;
        input.formId = documentId;
        input.pageId = pageId;
        input.value = this.controlerInput.control.value.value;

        this._httpService.post(this._formUrlService.controlUrl, input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                if (this.isTwoSymbol()) {
                    this._signingInitialService.initial = JSON.parse(this.controlerInput.control.value.value).data;
                } else {
                    this._signingSignatureService.signature = JSON.parse(this.controlerInput.control.value.value).data;
                }
                this.modalSave.emit(true);
                this._setFilledProgress();
                this._signatureControlService.setSigningDateChange(this.controlerInput);
                this.close();
                this._cdr.markForCheck();
            });
    }

    private _relativeCoords(event: any) {
        const bounds = event.target.getBoundingClientRect();
        const x = (event.touches ? event.touches[0].clientX : event.clientX) - bounds.left;
        const y = (event.touches ? event.touches[0].clientY : event.clientY) - bounds.top;
        return { x: x, y: y };
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.controlerInput.control, this.controlerInput.participantId);
    }
}
