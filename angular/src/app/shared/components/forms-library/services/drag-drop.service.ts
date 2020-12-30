import { Injectable } from '@angular/core';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { IBoxPosition } from '../models/table-documents.model';

@Injectable({ providedIn: 'root' })
export class DndService {

    private _boxPositions: IBoxPosition = new IBoxPosition();
    private _onDnd: boolean;
    private _moveDnd: boolean;
    private _control: ControlEditDto;
    private _pageControl: ControlEditDto;

    public pageControlIndex: number;
    public elementHtml: string;
    public pageElementHtml: string;
    public isDragging = false;

    constructor() {}

    public startDnd(element: HTMLDivElement): void {
        if (element) {
            this.elementHtml = element.innerHTML;
        }
    }

    public startPageDnd(element: HTMLDivElement): void {
        if (element) {
            this.pageElementHtml = element.innerHTML;
        }
    }

    public processMouseMove(event: MouseEvent): void {
        if (this.onDnd && this.moveDnd) {
            this.isDragging = true;
            this.boxPositions.left = event.clientX - 292;
            this.boxPositions.top = window.scrollY + event.clientY - 146;
            // console.log('drag drop => left    top: ', this.boxPositions.left , this.boxPositions.top);
        }
    }

    // TODO: remove to diferent service
    get onDnd(): boolean {
        return this._onDnd;
    }

    set onDnd(value: boolean) {
        if (this._onDnd !== value) {
            this._onDnd = value;

            if (!this._onDnd) {
                this.elementHtml = undefined;
                this.isDragging = false;
                this.pageElementHtml = undefined;
            }
        }
    }

    get control(): ControlEditDto {
        return this._control;
    }

    set control(value: ControlEditDto) {
        this._control = value;
    }

    get pageControl(): ControlEditDto {
        return this._pageControl;
    }

    set pageControl(value: ControlEditDto) {
        this._pageControl = value;
    }

    get moveDnd(): boolean {
        return this._moveDnd;
    }

    set moveDnd(value: boolean) {
        if (this._moveDnd !== value) {
            if (this.elementHtml && this.pageElementHtml) {
                if (this.onDnd) {
                    this._moveDnd = value;
                }
            } else {
                this._moveDnd = value;
            }
        }
    }

    get boxPositions(): IBoxPosition {
        return this._boxPositions;
    }

    set boxPositions(value: IBoxPosition) {
        this._boxPositions = value;
    }
}
