import { Injectable } from '@angular/core';
import {
    ControlEditDto, ControlFontInput, ControlInput, ControlPositionDto,
    ControlPositionInput, ControlSizeDto, ControlSizeInput, FormEditDto, PageEditDto,
    PageInput, UpdateFormInput
} from '@shared/service-proxies/service-proxies';
import { includes } from 'lodash';
import { PageControlHealperService } from './page-control-helper.service';

// TODO: nedd to remove to shared services
@Injectable()
export class FormLibraryDocumentHelperService {

    constructor(
        private _pageControlHealperService: PageControlHealperService,
    ) { }

    public mapFormDto(form: FormEditDto): UpdateFormInput {
        const input: UpdateFormInput = new UpdateFormInput();
        input.id = form.id;
        input.pages = this._mapPagesDto(form.pages);

        return input;
    }

    private _mapPagesDto(pages: PageEditDto[]): PageInput[] {
        const input: PageInput[] = pages.map((page) => {
            const pageInput: PageInput = new PageInput();
            pageInput.id = page.id;
            pageInput.controls = this._mapControlsDto(page.controls);

            return pageInput;
        });

        return input;
    }

    private _mapControlsDto(controls: ControlEditDto[]): ControlInput[] {
        const input: ControlInput[] = controls.map((control: ControlEditDto) => {
            const controlInput: ControlInput = new ControlInput();
            controlInput.id = this._mapControlId(control.id);
            controlInput.type = control.type;
            controlInput.layer = control.layer;
            controlInput.position = this._mapPositionDto(control.position);
            controlInput.size = this._mapSizeDto(control.size);
            controlInput.textPosition = control.textPosition;
            controlInput.font = this._mapFontDto(control);
            controlInput.participantId = control.participantId === 'default' ? undefined : control.participantId;
            controlInput.participantMappingItemId = this._mapParticipantMappingItem(control.participantMappingItemId);
            controlInput.title = control.title;
            controlInput.description = control.description;
            controlInput.placeholder = control.placeholder;
            controlInput.isProtected = control.isProtected;
            controlInput.isRequired = control.isRequired;
            controlInput.additionalSettings = control.additionalSettings;

            return controlInput;
        });

        return input;
    }

    private _mapParticipantMappingItem(participantMappingItemId: string): string {
        // const findIndex = this._participantSettingService.participantHelper
        //     .findIndex((participant: ParticipantMappingItemDto) => {
        //         return participant.id === participantMappingItemId;
        //     });

        // if (findIndex !== -1) {
        //     return participantMappingItemId;
        // } else {
        //     return undefined;
        // }

        return participantMappingItemId;
    }

    private _mapControlId(id: string): string {
        const checkedId = includes(id, 'Temp-index_') ? undefined : id;

        return checkedId;
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

    private _mapFontDto(control: ControlEditDto): ControlFontInput {
        const input: ControlFontInput = new ControlFontInput();
        input.sizeInPx = this._pageControlHealperService.getFontSize(control);

        return input;
    }
}
