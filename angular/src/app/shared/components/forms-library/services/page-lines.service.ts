import { Injectable } from '@angular/core';
import { ControlEditDto, ControlPositionDto, ControlSizeDto, FormEditDto, PageEditDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep, concat, isEmpty, uniq } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { ControlLine, ControlLineDot, DragControlDot, ILineDot, PageLine, StickingPosition } from '../models/table-documents.model';
import { DocumentControlHealperService } from './document-controller-helper.service';
import { DndService } from './drag-drop.service';
import { StickingLinesService } from './sticking-lines.service';

@Injectable()
export class PageLinesService {

    private _pageLines: PageLine[] = [];
    private _pageId: string;
    private _movedControl = false;
    private _stickingControl: Subject<StickingPosition> = new Subject<StickingPosition>();

    public page: PageEditDto;
    public isHasMatch: boolean;
    public controlEdit: ControlEditDto;
    public position: ControlPositionDto;

    dragVerticalDots: number[] = [];
    dragHorizontalDots: number[] = [];
    dragControl: DragControlDot = new DragControlDot();

    get movedControl(): boolean {
        return this._movedControl;
    }
    set movedControl(value: boolean) {
        if (this._movedControl !== value) {
            this._movedControl = value;
        }
    }
    get pageLines(): PageLine[] {
        return this._pageLines;
    }
    set pageLines(value: PageLine[]) {
        this._pageLines = value;
    }
    set pageId(value: string) {
        this._pageId = value;
    }
    get pageId(): string {
        return this._pageId;
    }

    constructor(
        private _dndService: DndService,
        private _stickingLinesService: StickingLinesService,
        private _controlHealper: DocumentControlHealperService,
    ) { }

    public setPageLines(forms: FormEditDto[]): void {
        this.pageLines = [];
        let pageNumber = 0;
        forms.forEach((form) => {
            form.pages.forEach((page: PageEditDto) => {
                pageNumber++;
                this.pageLines.push(
                    this._setPageLine(page, pageNumber)
                );
                this._setDots(page.id);
            });
        });
    }

    public setDragControl(controlDot: ControlLineDot, control?: ControlEditDto): void {
        const findIndex = this._findPageIndex();
        if (findIndex !== -1) {
            const input = control ? this._getCdkControl(control) : this._getDndControl();
            if (isEmpty(input)) { return; }

            input.position.left = controlDot.left;
            input.position.top = controlDot.top;
            this.dragControl.pageNumber = this.pageLines[findIndex].pageNumber;
            this.dragControl.control = this._mapControlLine(input);
            this._setDragDots(this.pageLines[findIndex]);
        }
    }

    public changePageLine(control: ControlEditDto): void {
        const findIndex = this._findPageIndex();
        if (findIndex !== -1 && control) {
            this.pageLines[findIndex].controls.push(
                this._mapControlLine(control)
            );
            this._setDots(this.pageId);
        }
    }

    public resetPageLine(page?: PageEditDto): void {
        if (!page && this.pageId) {
            const findIndex = this._findPageIndex();
            if (findIndex !== -1) {
                this._resetPageLine(this.page, findIndex);
            }
        } else if (page) {
            const findIndex = this._findPageIndex(page.id);
            if (findIndex !== -1) {
                this._resetPageLine(page, findIndex);
            }
        }
    }

    public getStickingControl$(): Observable<StickingPosition> {
        return this._stickingControl.asObservable();
    }

    private _setStickingControl(value: StickingPosition) {
        this._stickingControl.next(value);
    }

    private _resetPageLine(page: PageEditDto, index): void {
        this.pageLines.splice(index, 1, this._setPageLine(page, this.pageLines[index].pageNumber));
        this._setDots(page.id);
    }

    private _getDndControl(): ControlEditDto {
        return this._dndService.control;
    }

    private _getCdkControl(control?: ControlEditDto): ControlEditDto {
        const tempControl: ControlEditDto = new ControlEditDto();
        tempControl.position = new ControlPositionDto();
        tempControl.size = new ControlSizeDto();
        tempControl.size.height = control.size.height;
        tempControl.size.width = control.size.width;
        tempControl.type = control.type;

        return tempControl;
    }

    private _setPageLine(page: PageEditDto, pageNumber: number): PageLine {
        const pageLine = new PageLine(
            pageNumber, page.id, this._mapControlsLine(page),
        );

        return pageLine;
    }

    private _findPageIndex(pageId?: string): number {
        return this.pageLines.findIndex((page) => {
            return page.pageId === (pageId ? pageId : this.pageId);
        });
    }

    private _setDots(pageId: string): void {
        const sortDots = (a, b) => a - b;
        const lineDots = new ILineDot();
        this.pageLines.forEach((page: PageLine) => {
            if (page.pageId !== pageId) { return; }

            page.controls.forEach((control: ControlLine) => {
                lineDots.verticalDots = uniq(concat(
                    lineDots.verticalDots, [control.leftTop.left, control.center.left, control.rightBottom.left]
                )).sort(sortDots);
                lineDots.horizontalDots = uniq(concat(
                    lineDots.horizontalDots, [control.leftTop.top, control.center.top, control.rightBottom.top]
                )).sort(sortDots);
            });
            page.lineDots = lineDots;
        });
    }

    private _setDragDots(pageLine: PageLine): void {
        this._calculateDragDots();
        this._setMatchingDots(pageLine);
    }

    private _calculateDragDots(): void {
        this.dragHorizontalDots = this.dragVerticalDots = [];
        const sortDots = (a, b) => a - b;
        const { leftTop, center, rightBottom } = this.dragControl.control;
        const verticalDots = [leftTop.left, center.left, rightBottom.left];
        const horisontalDots = [Math.floor(leftTop.top), Math.floor(center.top), Math.floor(rightBottom.top)];
        this.dragVerticalDots = cloneDeep(concat(this.dragVerticalDots, verticalDots)).sort(sortDots);
        this.dragHorizontalDots = cloneDeep(concat(this.dragHorizontalDots, horisontalDots)).sort(sortDots);
    }

    private _setMatchingDots(pageLine: PageLine): void {
        const { verticalDots, horizontalDots } = pageLine.lineDots;
        const diffVertical = this._stickingLinesService.getDiff(verticalDots, this.dragVerticalDots);
        const diffHorisontal = this._stickingLinesService.getDiff(horizontalDots, this.dragHorizontalDots);
        const isMoqup = this._controlHealper.isMoqups(this.dragControl.control.type);
        const left = this.dragControl.control.leftTop.left -= isMoqup ? 0 : (diffVertical ? diffVertical : 0);
        const top = this.dragControl.control.leftTop.top -= isMoqup ? 0 : (diffHorisontal ? diffHorisontal : 0);

        if (this.controlEdit) {
            const control: ControlEditDto = new ControlEditDto();
            control.position = new ControlPositionDto();
            control.position.left = left;
            control.position.top = top;
            control.size = new ControlSizeDto();
            control.size = this.controlEdit.size;
            control.type = this.controlEdit.type;
            this.position = control.position;
            this.dragControl.control = this._mapControlLine(control);
        }
        this._calculateDragDots();

        const dragLeftTop = new ControlLineDot(left, top);
        const stickingPosition = new StickingPosition(diffVertical, diffHorisontal, dragLeftTop);
        this._setStickingControl(stickingPosition);

        if (this._controlHealper.isMoqups(this.dragControl.control.type)) { return; }

        pageLine.matchingDots.verticalDots = verticalDots.filter((item) => {
            return this.dragVerticalDots.includes(Math.floor(item));
        });
        pageLine.matchingDots.horizontalDots = horizontalDots.filter((item) => {
            return this.dragHorizontalDots.includes(Math.floor(item));
        });
        this.isHasMatch = pageLine.matchingDots.horizontalDots.length > 0
            || pageLine.matchingDots.verticalDots.length > 0;
    }

    private _mapControlsLine(page: PageEditDto): ControlLine[] {
        const controlLines: ControlLine[] = [];
        page.controls.forEach((control: ControlEditDto) => {
            if (this._controlHealper.isMoqups(control.type)) { return; }

            controlLines.push(
                this._mapControlLine(control)
            );
        });

        return controlLines;
    }

    private _mapControlLine(control: ControlEditDto): ControlLine {
        if (!control) { return; }

        const { left, top } = control.position;
        const { height, width } = control.size;

        const leftTop = new ControlLineDot(left, top);
        const leftBottom = new ControlLineDot(left, top + height);
        const rightTop = new ControlLineDot(left + width, top);
        const rightBottom = new ControlLineDot(rightTop.left, leftBottom.top);
        const center = new ControlLineDot(
            rightTop.left - (width / 2),
            leftBottom.top - (height / 2)
        );

        return new ControlLine(
            leftTop, leftBottom, rightTop, rightBottom, center, control.type
        );
    }
}
