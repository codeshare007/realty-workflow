import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Inject, Injector, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlValueInput, ISignatureInput, MediaCanvasWidth, SignatureJsonValue } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlType, ControlValueDto } from '@shared/service-proxies/service-proxies';
import { get } from 'lodash';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { takeUntil } from 'rxjs/operators';
import { SigningInitialService } from 'signing/services/signing-initial.service';
import { SigningSignatureService } from 'signing/services/signing-signature.service';
import { SigningService } from 'signing/services/signing.service';
import { SignatureControlService } from '../../services/signature-control.service';

@Component({
    selector: 'mat-signature-control-modal',
    templateUrl: './mat-signature-control-modal.component.html'
})
export class MatSignatureControlModalComponent extends AppComponentBase implements AfterViewInit {

    @HostBinding('class.signature-control-modal') class = true;

    @ViewChild('signaturePadRef', { static: false }) signaturePad: ElementRef;

    @Output() modalSave: EventEmitter<boolean> = new EventEmitter<boolean>();

    active = false;
    saving = false;
    context: CanvasRenderingContext2D;
    sigPadElement;
    isDrawing = false;
    initials = '';
    tabHeader: string;
    widthCanvas = 600;
    mediaWith: MediaCanvasWidth = MediaCanvasWidth.Large;

    constructor(
        injector: Injector,
        private _dialogRef: MatDialogRef<MatSignatureControlModalComponent>,
        private _signingService: SigningService,
        private _cdr: ChangeDetectorRef,
        private _signingSignatureService: SigningSignatureService,
        private _signingInitialService: SigningInitialService,
        private _signatureControlService: SignatureControlService,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
        private _breakpointObserver: BreakpointObserver,
        @Inject(MAT_DIALOG_DATA) public controlerInput: ISignatureInput,
    ) {
        super(injector);
        _dialogRef.disableClose = true;
    }

    ngAfterViewInit(): void {
        this._init();
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

    public getCanvasClass(): string {
        if (!this.active) { return; }

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

    public close(isSave?: boolean): void {
        this.active = false;
        this.controlerInput = undefined;
        this.initials = undefined;
        this._signingService.allowedChangeTab = true;
        this._dialogRef.close({ event: !!isSave });
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
                this._setFilledProgress();
                this._signatureControlService.setSigningDateChange(this.controlerInput);
                this.close(true);
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

    private _init(): void {
        this._mediaWidth();
        setTimeout(() => {
            this.widthCanvas = this._setWidthCanvas();
            this.tabHeader = this.isBase64() ? 'Draw' : 'Type';
            this.active = true;
            this.initials = this.controlerInput.control.type === ControlType.Signature
                || this.controlerInput.control.type === ControlType.OptionalSigning
                ? this._signingService.participantName
                : this._signingService.participantInitials;
        });
        this._signingService.allowedChangeTab = false;
        this._initCanvas();
    }

    private _setWidthCanvas(): number {
        const getSizeSigning = () => {
            switch (this.mediaWith) {
                case MediaCanvasWidth.Large:
                    return 600;
                case MediaCanvasWidth.Medium:
                    return 400;
                case MediaCanvasWidth.Small:
                    return 250;
            }
        };
        const getSizeInitial = () => {
            switch (this.mediaWith) {
                case MediaCanvasWidth.Large:
                case MediaCanvasWidth.Medium:
                case MediaCanvasWidth.Small:
                    return 252;
            }
        };

        return this.controlerInput.control.type === ControlType.Signature
            || this.controlerInput.control.type === ControlType.OptionalSigning
            ? getSizeSigning()
            : getSizeInitial();
    }


    private _mediaWidth(): void {
        this._breakpointObserver
            .observe(['(min-width: 810px)', '(min-width: 576px)'])
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((state: BreakpointState) => {
                if (state.breakpoints['(min-width: 810px)']) {
                    this.mediaWith = MediaCanvasWidth.Large;
                } else if (state.breakpoints['(min-width: 576px)']) {
                    this.mediaWith = MediaCanvasWidth.Medium;
                } else {
                    this.mediaWith = MediaCanvasWidth.Small;
                }
            });
    }

    private _initCanvas(): void {
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

                return;
            }

            if (value) {
                this.initials = value;
            }
        }
    }
}
