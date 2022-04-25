import { FormControl } from '@angular/forms';
import { ControlEditDto, ControlLayer, ControlType, FormListDto, ParticipantMappingItemDto } from '@shared/service-proxies/service-proxies';

export class TableDocument {
    constructor(
        public isChecked: boolean = false,
        public id?: number,
        public name?: string,
        public modifiered?: moment.Moment,
        public img?: string,
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

export class MouseClientCoordinate {
    constructor(
        public clientX?: number,
        public clientY?: number,
        public control?: ControlEditDto,
        public isCtrlMove: boolean = false,
    ) { }
}

export class DragPositionElement {
    constructor(
        public x: number,
        public y: number,
    ) { }
}

export class DragControlDot {
    constructor(
        public pageNumber?: number,
        public control?: ControlLine,
    ) { }
}

export class PageLine {
    constructor(
        public pageNumber?: number,
        public pageId?: string,
        public controls: ControlLine[] = [],
        public lineDots: ILineDot = new ILineDot(),
        public matchingDots: ILineDot = new ILineDot(),
    ) { }
}

export class AccessLimitDots {
    constructor(
        public minDot: number,
        public maxDot: number,
        public dot: number,
    ) { }
}

export class StickingPosition {
    constructor(
        public vertical: number,
        public horisontal: number,
        public dragLeftTop: ControlLineDot,
    ) { }
}

export class LimitDotOption {
    constructor(
        public diff: number,
        public stickingDot: number,
    ) { }
}

export class DotOption {
    constructor(
        public diff: number,
        public stickingDot: number,
        public dot: number,
    ) { }
}

export class ILineDot {
    constructor(
        public verticalDots: number[] = [],
        public horizontalDots: number[] = [],
    ) { }
}

export class ControlLine {
    constructor(
        public leftTop: ControlLineDot,
        public leftBottom: ControlLineDot,
        public rightTop: ControlLineDot,
        public rightBottom: ControlLineDot,
        public center: ControlLineDot,
        public type: ControlType,
    ) { }
}

export class ControlLineDot {
    constructor(
        public left: number,
        public top: number,
    ) { }
}

export class IBoxPosition {
    constructor(
        public left?: number,
        public top?: number,
    ) { }
}

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

export class SwitchLayer {
    constructor(
        public layer: ControlLayer,
        public isShow: boolean,
    ) { }
}

export class SigningProgressItem {
    constructor(
        public id?: string,
        public isOptionalSign: boolean = false,
        public optionalPermissions: SignatureJsonValue = new SignatureJsonValue(),
        public isFilled: boolean = false,
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

export class MultiplSelectedMode {
    constructor(
        public layer?: ControlLayer,
        public viewMode?: ViewMode,
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

export class ISignatureInput {
    constructor(
        public control: ControlEditDto,
        public documentId: string,
        public pageId: string,
        public participantId: string,
    ) { }
}

export class MultipleCopyControl {
    constructor(
        public control: ControlEditDto,
        public documentId: string,
        public pageId: string,
        public controlIndex: number,
    ) { }
}

export class InitialSettings {
    constructor(
        public placements?: ActionsFormItem[],
        public aligments?: ActionsFormItem[],
        public selectedParticipants?: ActionsFormItem[],
        public documents: InitialSettingDocument[] = [],
        public controltype?: ControlType,
    ) { }
}

export class InitialSettingDocument {
    constructor(
        public name?: string,
        public documentId?: string,
        public pages: ActionsFormItem[] = [],
    ) { }
}

export class CopyControlSettings {
    constructor(
        public align?: AlignControl,
        public placement?: PlacementControl,
        public participantIds?: string[],
        public documentsPages?: DocumentsPages[],
        public copyControl?: ControlEditDto,
    ) { }
}

export class DocumentsPages {
    constructor(
        public documentId?: string,
        public pages?: ActionsFormItem[],
    ) { }
}

export class ActionsFormItem {
    constructor(
        public title?: string,
        public enumType?: any,
        public isSelected: boolean = false,
        public value: string = '',
        public id: string = '',
    ) { }
}

export class AccessSettingLayer {
    constructor(
        public type?: ControlLayer,
        public accessLayers?: ControlLayer[],
    ) { }
}

export class IControlParticipant {
    constructor(
        public participantId: string,
        public order: number,
    ) { }
}

export class TabIndexPage {
    constructor(
        public control: ControlEditDto,
        public pageNumber: number,
    ) { }
}

export class TabIndexControl {
    constructor(
        public id: string,
        public tabIndex: number,
        public top: number,
        public height: number,
        public isActive: boolean = false,
        public pageOrder: number,
    ) { }
}

export class ControlDetails {
    constructor(
        public placeholder?: string,
        public participantId?: string, // temp
        public isProtected?: boolean,
        public isRequired?: boolean,
        public title?: string,
        public description?: string,
        public photos?: string,
    ) { }
}

export class DocumentInfo {
    constructor(
        public name?: string,
        public documents: DocumentInfoItem[] = [],
    ) { }
}

export class DocumentInfoItem {
    constructor(
        public name: string,
        public pages: PageInfo[] = [],
        public documentId: string,
    ) { }
}

export class PageInfo {
    constructor(
        public order: number,
        public pageId: string,
    ) { }
}

export class ICopyPastControl {
    constructor(
        public control: ControlEditDto,
        public controlIndex: number,
        public pageId: string,
    ) { }
}

export class DropdownSavingData {
    constructor(
        public controlId: string,
        public pageId: string,
        public documentId: string,
        public value: string,
    ) { }
}

export class DropdownSetting {
    constructor(
        public options: string[],
        public model: string
    ) { }
}

export class SignatureJsonValue {
    constructor(
        public data?: string,
        public accept: boolean = false,
        public decline: boolean = false,
    ) { }
}

export class ParticipantMargeForm {
    constructor(
        public formName: string,
        public participantMappingItems: ParticipantMappingItemDto[],
        public controls: ParticipantMargeControlsGroup[],
    ) { }
}

export class ParticipantMargeControlsGroup {
    constructor(
        public parcipantMargeId: string,
        public controls: ParticipantMargeControl[],
    ) { }
}

export class ParticipantMargeControl {
    constructor(
        public controlId: string,
        public participantMappingItemId: string,
        public parcipantId?: string,
    ) { }
}

export class ControlValueInput {
    constructor(
        public libraryId?: string,
        public transactionId?: string,
        public signingId?: string,
        public participantCode?: string,
        public formId?: string,
        public pageId?: string,
        public controlId?: string,
        public value?: string,
    ) { }
}

export class AccessTypeItem {
    constructor(
        public type?: AccessSettingType,
        public id?: string,
        // public formId?: string,
        public publicId?: string,
    ) { }
}

export class ParticipantFormControl extends FormControl {
    public participantId: string;

    constructor(...args) {
        super(...args);
    }
}

export enum AccessSettingType {
    FormLibrary = 0,
    TransactionFormDesign = 1,
    SigningFormDesign = 2,
    ParticipantCode = 3,
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

export enum AlignControl {
    AlignLeft = 1,
    AlignCenter = 2,
    AlignRight = 3,
}
export enum PlacementControl {
    PlacementTop = 1,
    PlacementBottom = 2,
}

export enum TypeControlAction {
    Delete = 0,
    Copy = 1,
    Assign = 2,
    TextSize = 3,
    ResetLines = 4,
    ColorPicker = 5,
    TempControl = 6,
    DropdownControl = 7,
    ParticipantSetting = 8,
    TextPosition = 9,
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

export enum CopyControlType {
    Single = 1,
    Multiple = 2,
}

export interface IHasFormListDto {
    form: FormListDto;
    id: string;
}

export enum TypeIndex {
    Saving = 1,
    Tab = 2,
}

export enum ControlDetailsCheckbox {
    isProtected = 1,
    isRequired = 2,
}

export enum MatchingDotsType {
    Vertical = 1,
    Horisontal = 2,
}

export enum MediaCanvasWidth {
    Large = 0,
    Medium = 1,
    Small = 2,
}

export enum KEY_CODE {
    UP_ARROW = 'ArrowUp',
    RIGHT_ARROW = 'ArrowRight',
    DOWN_ARROW = 'ArrowDown',
    LEFT_ARROW = 'ArrowLeft',
    CONTROL = 'Control',
    ENTER = 'Enter',
    TAB = 'Tab',
    KEY_C = 'c',
    KEY_V = 'v',
    KEY_DEL = 'Delete',
}
