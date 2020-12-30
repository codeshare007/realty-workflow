import {
    ControlEditDto, ControlFontDto, ControlFontInput, ControlInput, ControlPositionDto,
    ControlPositionInput, ControlSizeDto, ControlSizeInput, FormEditDto, PageEditDto,
    PageInput, UpdateFormInput
} from '@shared/service-proxies/service-proxies';

export class FormLibraryDocumentHelperService {

    public mapFormDto(form: FormEditDto): UpdateFormInput {
        const input: UpdateFormInput = new UpdateFormInput();
        input.id = form.id;
        input.pages = this._mapPagesDto(form.pages);

        return input;
    }

    private _mapPagesDto(pages: PageEditDto[]): PageInput[] {
        const input: PageInput[] = pages.map((page) => {
            const pageInput: PageInput = new PageInput();
            pageInput.id = page.id
            pageInput.controls = this._mapControlsDto(page.controls);

            return pageInput;
        });

        return input;
    }

    private _mapControlsDto(controls: ControlEditDto[]): ControlInput[] {
        const input: ControlInput[] = controls.map((control) => {
            const controlInput: ControlInput = new ControlInput();
            controlInput.id = control.id;
            controlInput.type = control.type;
            controlInput.position = this._mapPositionDto(control.position);
            controlInput.size = this._mapSizeDto(control.size);
            controlInput.font = this._mapFontDto(control.font);

            return controlInput;
        });

        return input;
    }

    private _mapPositionDto(position: ControlPositionDto): ControlPositionInput {
        const { top, left } = position;
        const input: ControlPositionInput = new ControlPositionInput();
        input.top = top;
        input.left = left;

        return input;
    }

    private _mapSizeDto(size: ControlSizeDto): ControlSizeInput {
        const { width, height } = size;
        const input: ControlSizeInput = new ControlSizeInput();
        input.width = width;
        input.height = height;

        return input;
    }

    private _mapFontDto(font: ControlFontDto): ControlFontInput {
        const input: ControlFontInput = new ControlFontInput();
        input.sizeInPx = font.sizeInPx;

        return input;
    }
}
