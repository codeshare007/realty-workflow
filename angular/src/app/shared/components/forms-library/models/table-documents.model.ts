import { ControlEditDto, ControlLayer, FormListDto } from '@shared/service-proxies/service-proxies';

export class TableDocument {
    constructor(
        public isChecked: boolean = false,
        public id?: number,
        public name?: string,
        public modifiered?: moment.Moment,
        public img?: string,
    ) { }
}

// export class IDocument {
//     constructor(
//         public id?: number,
//         public name?: string,
//         public modifiered?: moment.Moment,
//         public pages?: IDocumentPage[],
//     ) { }
// }

// export class IDocumentPage {
//     constructor(
//         public id?: number,
//         public pageNumber?: number,
//         public pageUrl?: string,
//         public controls?: IDocumentPageControl[]
//     ) { }
// }

export class IDocumentPageControl {
    constructor(
        public type?: IControlType,
        public options?: IControlOption,
        public id?: number,
        public tabIndex?: number,
    ) { }
}

export class IControlOption {
    constructor(
        public top?: number,
        public left?: number,
        public height?: number,
        public width?: number,
        public zIndex?: number,
        public fontSize?: number,
    ) { }
}

export class IDragDropControl {
    constructor(
        public content: IDocumentPageControl,
        public effectAllowed: string = 'move',
        public disable: boolean = false,
        public handle: boolean = false,
    ) { }
}

export class IDragDropEvent {
    constructor(
        public event: DragEvent,
        public control: IDragDropControl,
    ) { }
}

export class IBoxPosition {
    constructor(
        public left?: number,
        public top?: number,
    ) { }
}
// export class IContainerPosition {
//     constructor(
//         public left?: number,
//         public top?: number,
//         public right?: number,
//         public bottom?: number,
//     ) { }
// }

// export class IMousePosition {
//     constructor(
//         public x?: number,
//         public y?: number
//     ) { }
// }

// export class IMouseClickPosition {
//     constructor(
//         public x?: number,
//         public y?: number,
//         public left?: number,
//         public top?: number,
//     ) { }
// }


export class PageEdit {
    constructor(
        public controls: PageControlEdit[],
        public id: string,
    ) { }
}
export class PageControlEdit {
    constructor(
        public control: ControlEditDto,
        public showActions: boolean = false,
    ) { }
}

export class IControlActions {
    constructor(
        public type?: TypeControlAction,
        public index?: number,
    ) { }
}

export class SwitchSetting {
    constructor(
        public allowSwitchMode?: boolean,
        public viewModeSettings?: ViewModeSetting[],
    ) { }
}

export class ViewModeSetting {
    constructor(
        public layer?: ControlLayer,
        public viewModes?: ViewMode[],
    ) { }
}

export class ViewMode {
    constructor(
        public title?: string,
        public type?: ViewModesType,
        public value: boolean = false,
    ) { }
}

export class GetAllFormsInput {
    constructor(
        public sorting: string | null | undefined,
        public maxResultCount: number | undefined,
        public skipCount: number | undefined,
    ) { }
}
export class SelectedValue {
    constructor(
        public name: string,
        public value: any
    ) { }
}

export enum IControlType {
    text = 1,
    number = 2,
    date = 3,
    signature = 4,
}

export enum IPageType {
    design = 1,
    edit = 2,
    view = 3,
}

export enum StatusControl {
    Off = 0,
    Resize = 1,
    Move = 2,
}

export enum StatusPage {
    Denied = 0,
    Allowed = 1,
}

export enum StatusDnD {
    Off = 0,
    On = 1,
    Move = 2,
}

export enum TypeControlAction {
    Delete = 0,
    Coppy = 1,
    Assign = 2,
    TextSize = 3,
}

export enum StatusControlAction {
    Show = 0,
    Hide = 1,
}

export enum ViewModesType {
    Edit = 0,
    Populate = 1,
    View = 2,
}

export interface IHasFormListDto {
    form: FormListDto;
    id: string;
}
