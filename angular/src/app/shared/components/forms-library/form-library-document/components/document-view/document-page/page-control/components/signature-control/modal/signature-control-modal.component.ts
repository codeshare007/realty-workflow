import { Component, ElementRef, EventEmitter, HostBinding, Injector, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    selector: 'signature-control-modal',
    templateUrl: './signature-control-modal.component.html',
})
export class SignatureControlModalComponent extends AppComponentBase {

    @HostBinding('class.signature-control-modal') class = true;

    @ViewChild('signatureControlModal', { static: true }) modal: ModalDirective;
    @ViewChild(NgForm, { static: true }) photoForm: NgForm;
    @ViewChild('signaturePadRef', { static: false }) signaturePad: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    context;
    sigPadElement;
    img;
    isDrawing = false;

    constructor(
        injector: Injector,
    ) {
        super(injector);
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

    public drawSave(): void {
        this.img = this.sigPadElement.toDataURL('image/png');
    }

    public show(): void {
        this.active = true;
        this.modal.show();
    }

    public onShown(): void {
        this.sigPadElement = this.signaturePad.nativeElement;
        this.context = this.sigPadElement.getContext('2d');
        this.context.strokeStyle = '#3742fa';
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save() {
        this.close();
    }

    private _relativeCoords(event: any) {
        const bounds = event.target.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        return { x: x, y: y };
    }
}
