import { Injectable } from '@angular/core';
import { PageControlEdit, PageEdit, SelectedValue } from '@app/shared/components/forms-library/models/table-documents.model';
import { MultiSelectControlsService } from '@app/shared/components/forms-library/services/multi-select-controls.service';
import { ControlEditDto, ControlLayer, PageEditDto, TextPositionType } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';

@Injectable()
export class DocumentPageHelperServices {

    private _page: PageEdit;
    public fontSizeList: SelectedValue[] = [];
    public fontPositionList: SelectedValue[] = [];

    get page(): PageEdit {
        return this._page;
    }

    set page(value: PageEdit) {
        this._page = value;
    }

    constructor(
        private _multiSelectControlsService: MultiSelectControlsService,
    ) {
        this._setFontSizeList();
        this._setFontPositionList();
    }
    public setActionShow(index: number, key: boolean = false): void {
        this.page.controls.map((control) => {
            control.showActions = false;
        });
        this.page.controls[index].showActions = key;
    }

    public setControlEditDto(mainLayer: ControlLayer, control: ControlEditDto, length: number): ControlEditDto {
        const copyControl = cloneDeep(control);
        copyControl.position.left += 20;
        copyControl.position.top += 20;
        copyControl.id = `Temp-index_${length}_left-${copyControl.position.left
            }_top-${copyControl.position.top
            }_${this._multiSelectControlsService.isMultiSelected(control)
                ? ''
                : 'multi_' + this._multiSelectControlsService.multiControls.length}`;
        copyControl.layer = mainLayer;

        return copyControl;
    }

    public mapPageEditDto(page: PageEditDto): PageEdit {
        const pageEdit: PageEdit = new PageEdit(
            page.controls.map((control) => {
                const input: PageControlEdit = new PageControlEdit(control);

                return input;
            }),
            page.id,
        );

        return pageEdit;
    }

    private _setFontSizeList(): void {
        for (let i = 8; i < 46; i++) {
            this.fontSizeList.push(new SelectedValue(`${i}px`, i));
        }
    }

    private _setFontPositionList(): void {
        this.fontPositionList = [
            new SelectedValue(`Left`, TextPositionType.Left),
            new SelectedValue(`Center`, TextPositionType.Center),
            new SelectedValue(`Right`, TextPositionType.Right)
        ];
    }

}
