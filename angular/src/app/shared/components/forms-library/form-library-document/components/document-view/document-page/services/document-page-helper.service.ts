import { PageControlEdit, PageEdit, SelectedValue } from '@app/shared/components/forms-library/models/table-documents.model';
import { PageEditDto } from '@shared/service-proxies/service-proxies';

export class DocumentPageHelperServices {

    // private _controls: PageControlEdit[] = [];
    private _page: PageEdit;
    public fontSizeList: SelectedValue[] = [];

    get page(): PageEdit {
        return this._page;
    }

    set page(value: PageEdit) {
        this._page = value;
    }

    constructor() {
        this._setFontSizeList();
    }

    // get controls(): PageControlEdit[] {
    //     return this._controls;
    // }

    // set controls(controls: PageControlEdit[]) {
    //     this._controls = controls;
    // }

    public setActionShow(index: number, key: boolean = false): void {
        this.page.controls.map((control) => {
            control.showActions = false;
        });
        this.page.controls[index].showActions = key;
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
}
