import { Injectable } from '@angular/core';
import { ActionsFormItem, AlignControl, CopyControlSettings, DocumentsPages, InitialSettings, PlacementControl } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlEditDto, ControlLayer, ControlType, FormEditDto, PageEditDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { FormControlsService } from './form-controls.service';

@Injectable()
export class ControlCopySettingService {
    private _isCopyControlSettings: Subject<CopyControlSettings> = new Subject<CopyControlSettings>();

    withControl: number;

    constructor(
        private _formControlsService: FormControlsService,
    ) { }

    private _setCopyControlSettings(value: CopyControlSettings): void {
        this._isCopyControlSettings.next(value);
    }

    public getCopyControlSettings$(): Observable<CopyControlSettings> {
        return this._isCopyControlSettings.asObservable();
    }

    public addRangeCopyControls(form: FormEditDto, controls: ControlEditDto[], findPage: ActionsFormItem): PageEditDto[] {
        const pageNumbers = this.getPageNumbers(findPage);

        return form.pages.map((page: PageEditDto, index: number) => {
            pageNumbers.forEach((item) => {
                if ((index + 1) === (+item)) {
                    controls.forEach((control) => {
                        page.controls.push(control);
                    });
                }
            });

            return page;
        });
    }

    public addCopyControls(form: FormEditDto, controls: ControlEditDto[]): PageEditDto[] {
        return form.pages.map((page: PageEditDto) => {
            controls.forEach((control) => {
                page.controls.push(control);
            });

            return page;
        });
    }

    public initCopyControl(setting: InitialSettings): void {
        this.withControl = setting.controltype === ControlType.Initials ? 55 : 145;
        const align = setting.aligments.find((align) => align.isSelected);
        const placement = setting.placements.find((placement) => placement.isSelected);
        const participantIds: string[] = setting.selectedParticipants
            .map((participant) => participant.id);
        const documentsPages = setting.documents.map((document) => {
            return new DocumentsPages(document.documentId, document.pages);
        });
        const copyControlSettings = new CopyControlSettings(
            align.enumType,
            placement.enumType,
            participantIds,
            documentsPages,
            this._setPositionControl(align.enumType, placement.enumType, setting.controltype)
        );

        this._setCopyControlSettings(copyControlSettings);
    }

    public setPositionControls(setting: CopyControlSettings, layer: ControlLayer): ControlEditDto[] {
        const copyControls: ControlEditDto[] = [];

        setting.participantIds.forEach((id: string) => {
            const cloneControl = cloneDeep(setting.copyControl);
            cloneControl.participantId = id;
            cloneControl.layer = layer;
            copyControls.push(cloneControl);
        });

        return this._setControlsPositions(setting, copyControls);
    }

    public getPageNumbers(page: ActionsFormItem): string[] {
        const range = page.value;
        const pageNumbers: string[] = [];
        const arrayComa = range.split(',');
        arrayComa.forEach((item) => {
            if (!item.includes('-')) {
                this._setPageNumbers(item, pageNumbers);
            } else {
                this._setPageRangeNumbers(item, pageNumbers);
            }
        });

        return pageNumbers;
    }

    private _setPageNumbers(value: string, pageNumbers: string[]): void {
        const find = pageNumbers.find((number) => {
            return number === value;
        });
        if (!find) {
            pageNumbers.push(value);
        }
    }

    private _setPageRangeNumbers(item: string, pageNumbers: string[]): void {
        const arrayComa = item.split('-').sort((a, b) => (+a) - (+b));
        for (let i = +(arrayComa[0]); i <= +(arrayComa[1]); i++) {
            this._setPageNumbers(i + '', pageNumbers);
        }
    }

    private _setControlsPositions(setting: CopyControlSettings, controls: ControlEditDto[]): ControlEditDto[] {
        if (controls.length > 1) {
            const leftPosition: number = setting.copyControl.position.left;
            switch (setting.align) {
                case AlignControl.AlignLeft:
                    this._shiftToLeft(Math.floor(leftPosition), controls);
                    break;
                case AlignControl.AlignCenter:
                    const centerPoint = 590;
                    let controlsWirth = 0;
                    for (let i = 0; i < controls.length; i++) {
                        controlsWirth += this.withControl;
                    }
                    controlsWirth -= 5;
                    const startPoint = centerPoint - (controlsWirth / 2);
                    this._shiftToLeft(Math.floor(startPoint), controls);
                    break;
                case AlignControl.AlignRight:
                    this._shiftToRight(Math.floor(leftPosition), controls);
                    break;
            }
        }

        return controls;
    }

    private _shiftToLeft(startPoint: number, controls: ControlEditDto[]): void {
        let leftPosition: number = startPoint;
        controls.map((control: ControlEditDto, index: number) => {
            if (index > 0) {
                leftPosition += this.withControl;
            }
            control.position.left = leftPosition;

            return control;
        });
    }

    private _shiftToRight(startPoint: number, controls: ControlEditDto[]): void {
        let leftPosition: number = startPoint;
        controls.map((control: ControlEditDto, index: number) => {
            if (index > 0) {
                leftPosition -= this.withControl;
            }
            control.position.left = leftPosition;

            return control;
        });
    }

    private _setPositionControl(align: AlignControl, placement: PlacementControl, type: ControlType): ControlEditDto {
        const initialControl = this._formControlsService.controls.find((control) => {
            return control.type === type;
        });
        let leftPosition: number;
        let topPosition: number;
        switch (align) {
            case AlignControl.AlignLeft:
                leftPosition = 20;
                break;
            case AlignControl.AlignCenter:
                leftPosition = 590;
                break;
            case AlignControl.AlignRight:
                leftPosition = type === ControlType.Initials ? 1166 : 1074;
                break;
        }
        switch (placement) {
            case PlacementControl.PlacementTop:
                topPosition = 20;
                break;
            case PlacementControl.PlacementBottom:
                topPosition = 1684;
                break;
        }
        initialControl.position.left = leftPosition;
        initialControl.position.top = topPosition;

        return initialControl;
    }
}
