import { Injectable } from '@angular/core';
import { IControlOption } from '../models/table-documents.model';

@Injectable({ providedIn: 'root' })
export class ResizableBoxService {

    private _boxSize: IControlOption = new IControlOption();
    private _isStopped: boolean;

    public elementHtml: DOMRect;
    public isDragging = false;

    get isStopped(): boolean {
        return this._isStopped;
    }

    set isStopped(value: boolean) {
        this._isStopped = value;
    }

    get boxSize(): IControlOption {
        return this._boxSize;
    }

    set boxSize(value: IControlOption) {
        this._boxSize = value;
    }


    public startResize(element: HTMLDivElement): void {
        if (element) {
            this.elementHtml = element.getBoundingClientRect();
        }
    }

    public processResizable(event: MouseEvent): void {
        if (!this.isStopped && this.elementHtml) {
            this.boxSize.width = event.clientX - this.elementHtml.left;
            this.boxSize.height = event.clientY - this.elementHtml.top;
        }
    }
}
