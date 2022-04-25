import { Injectable } from '@angular/core';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { Observable, Subject } from 'rxjs';
import { IBoxPosition, MouseClientCoordinate } from '../models/table-documents.model';

@Injectable({ providedIn: 'root' })
export class DndService {

    private _boxPositions: IBoxPosition = new IBoxPosition();
    private _onDnd = false;
    private _moveDnd = false;
    private _control: ControlEditDto;
    private _pageControl: ControlEditDto;
    private _lineChange: Subject<MouseClientCoordinate> = new Subject<MouseClientCoordinate>();
    public pageControlIndex: number;
    public elementHtml: string;
    public pageElementHtml: string;
    public isDragging = false;

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

    constructor() { }

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
            const marginLeft = 288;
            const marginTop = 142;
            this.boxPositions.left = Math.floor(event.clientX - marginLeft);
            this.boxPositions.top = Math.floor(window.scrollY + event.clientY - marginTop);
            // DndJJ mouse position
            // console.log('box Positions: ', this.boxPositions.top, this.boxPositions.left);
        }
    }

    public getLineChange$(): Observable<MouseClientCoordinate> {
        return this._lineChange.asObservable();
    }

    public setLineChange(value: MouseClientCoordinate): void {
        this._lineChange.next(value);
    }
}
