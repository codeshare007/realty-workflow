import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactListDto, ControlEditDto, ControlLayer, ControlType, ParticipantMappingItemDto, ParticipantMappingItemsInput } from '@shared/service-proxies/service-proxies';
import { get, isNull, isNumber, isUndefined } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { AccessSettingLayer, DocumentInfo, InitialSettings, MultiplSelectedMode, ParticipantMargeForm, SwitchLayer, SwitchSetting, ViewModeSetting, ViewModesType } from '../../../models/table-documents.model';
import { ControlCopyPasteService } from '../../../services/control-copy-paste.service';
import { DocumentControlHealperService } from '../../../services/document-controller-helper.service';
import { DndService } from '../../../services/drag-drop.service';
import { MultiSelectControlsService } from '../../../services/multi-select-controls.service';
import { PageLinesService } from '../../../services/page-lines.service';
import { ParticipantMargeService } from '../../../services/participant-marge.service';
import { InitialPageModalComponent } from './modals/initial-pages/initial-page-modal.component';
import { ParticipantMargeModalComponent } from './modals/participant-marge/participant-marge-modal.component';
import { ControlDetailsService } from './services/control-details.service';
import { ControlCopySettingService } from './services/controls-copy-setting.service';
import { FormControlsService } from './services/form-controls.service';
import { FormLibraryDocumentService } from './services/form-library-document.service';
import { ParticipantSettingService } from './services/participant-setting.service';


@Component({
    selector: 'form-library-controls',
    templateUrl: './form-library-controls.component.html',
})
export class FormLibraryControlsComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {

    @HostBinding('class.form-library-controls') class = true;

    @ViewChild('participantMargeModalRef') participantMargeModal: ParticipantMargeModalComponent;
    @ViewChild('initialPageRef') initialPageModal: InitialPageModalComponent;

    @Input() switchSetting: SwitchSetting;
    @Input() accessSetting: AccessSettingLayer;
    @Input() participants: ContactListDto[] = [];
    @Input() participantMappingItems: ParticipantMappingItemDto[] = [];
    @Input() documentInfo: DocumentInfo;
    @Input() mainLayer: ControlLayer;
    @Input() formId: string;
    @Input() mainId: string;
    @Input() showModal: boolean;

    firstInit = true;
    formControls: ControlEditDto[] = [];
    formControlMoqups: ControlEditDto[] = [];
    private _isEditMod = false;
    isDisabledView = false;
    isEditModChange = false;
    selectParticipant: ContactListDto;
    selectParticipantSetting: ParticipantMappingItemsInput;
    participantClass: string;
    settings = {
        participantsSettingTabSelected: true,
        participantTabSelected: true,
        controlsTabSelected: true,
        layersTabSelected: false,
        controlDetails: true,
        controlMoqups: true,
    };
    // settings = {
    //     participantsSettingTabSelected: false,
    //     participantTabSelected: false,
    //     controlsTabSelected: false,
    //     layersTabSelected: true,
    //     controlDetails: false,
    //     controlMoqups: false,
    // };
    switchLayers: SwitchLayer[] = [];
    isControlSelected = false;
    layer: ControlLayer;

    readonly controlLayer = ControlLayer;
    readonly controlType = ControlType;

    get participantMargeForms(): ParticipantMargeForm[] {
        return this._participantMargeService.participantMargeForms
            .filter((item: ParticipantMargeForm) => {
                return item.controls.length;
            });
    }

    constructor(
        injector: Injector,
        public _formControlsService: FormControlsService,
        private _cdr: ChangeDetectorRef,
        private _dndService: DndService,
        private _controlCopySettingService: ControlCopySettingService,
        private _participantMargeService: ParticipantMargeService,
        private _formLibraryDocumentService: FormLibraryDocumentService,
        private _controlDetailsService: ControlDetailsService,
        private _multiSelectControlsService: MultiSelectControlsService,
        private _controlCopyPasteService: ControlCopyPasteService,
        private _pageLinesService: PageLinesService,
        private _controlHealper: DocumentControlHealperService,
        private _participantSettingService: ParticipantSettingService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.switchSetting && this.accessSetting && this.switchSetting) {
            this._initLayers();
            this.layer = this.accessSetting.type;
            if (this.mainLayer === ControlLayer.Library) {
                this.isEditModChange = true;
            }
        }

        if (changes.participantMappingItems && this.participantMappingItems.length) {
            this._setControlParticipantsSetting();
        }

        if (changes.participants && this.participants.length) {
            this._setControlParticipants();
        }
    }

    ngOnInit(): void {
        this.formControls = this._formControlsService.controls;
        this.formControlMoqups = this._formControlsService.controlsMoqups;
        this._getModeChange();
        this._isControlSelected();
        this._getParticipantsChange();
    }

    ngAfterViewInit(): void {
        if (this.mainLayer === ControlLayer.Signing) {
            this._participantMargeFormsSubject();
        }
    }

    public onZoomSelected(event): void {

    }

    public showInitialPage(): void {
        this.initialPageModal.show(ControlType.Initials);
    }

    public showSignaturePage(): void {
        this.initialPageModal.show(ControlType.Signature);
    }

    public isHover(type: ControlType): boolean {
        return this._dndService.onDnd
            && this._dndService.moveDnd
            && isNumber(get(this._dndService.control, 'type'))
            && type === this._dndService.control.type;
    }

    public isDisablledControl(type: ControlType): boolean {
        switch (type) {
            case ControlType.DateTime:
            case ControlType.TextArea:
            case ControlType.TextField:
            case ControlType.Dropdown:
                return !this._isEditMod;
            default:
                return this.isDisabledView;
        }
    }

    public isMoqupLine(type: ControlType): boolean {
        return this._controlHealper.isMoqupLine(type);
    }

    public getControlClass(): string {
        const controlClass = 'form-library-controls__wrapper__list__item-control';

        return controlClass;
    }

    public onParticipantSettingSelect(event: ParticipantMappingItemsInput): void {
        if (!isNull(event)) {
            this.selectParticipantSetting = event;
            this._reloadSettingControls(this.selectParticipantSetting.id);
        } else {
            this._reloadSettingControls();
        }
    }

    public onParticipantSelect(event: ContactListDto): void {
        if (!isNull(event)) {
            this.selectParticipant = event;
            this._reloadControls(this.selectParticipant.id);
        } else {
            this._reloadControls();
        }
    }

    public onSelected(event, libraryControl: HTMLDivElement, item: ControlEditDto): void {
        if (this.isDisablledControl(item.type)) { return; }

        event.preventDefault();
        this._multiSelectControlsService.multiControls = [];
        this._multiSelectControlsService.setReloadMultiControl(true);
        this._controlCopyPasteService.reset();
        this._pageLinesService.resetPageLine();
        this._dndService.onDnd = true;
        this._dndService.control = item;
        this._dndService.startDnd(libraryControl);
    }

    public onSwitch(viewModes, type: ViewModesType): void {
        const radioSwitch = (mode) => {
            mode.map((item) => item.value = false);
        };
        radioSwitch(viewModes);
        viewModes.map((item) => {
            if (type === item.type) {
                item.value = true;
            }
        });
    }

    public onInitialSave(event: InitialSettings): void {
        this._controlCopySettingService.initCopyControl(event);
    }

    public showMergeModal(): void {
        this.participantMargeModal.show();
    }

    public onParticipantMargeSave(event: any): void {
        console.log('event: ', event);
    }

    private _isControlSelected(): void {
        this._controlDetailsService.getIsControlSelected$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: boolean) => {
                this.isControlSelected = result;
            });
    }

    private _initLayers(): void {
        this.switchLayers = this.switchSetting
            .viewModeSettings.map((item: ViewModeSetting) => {
                return this._isLayersActive(item.layer);
            });
    }

    private _getModeChange(): void {
        this._formLibraryDocumentService.getModeChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: MultiplSelectedMode) => {
                if (result && result.layer === this.accessSetting.type) {
                    const { type, value } = result.viewMode;
                    if (this.isEditModChange) {
                        this._isEditMod = true;
                        this.isEditModChange = false;
                    } else {
                        this._isEditMod = type === ViewModesType.Edit ? value : false;
                    }
                    this.isDisabledView = type === ViewModesType.View ? value : false;
                }
                this._cdr.markForCheck();
            });
    }

    private _isLayersActive(layer: ControlLayer): SwitchLayer {
        const find = this.accessSetting.accessLayers
            .find((item: ControlLayer) => {
                return item === layer;
            });

        return new SwitchLayer(layer, !isUndefined(find));
    }

    private _reloadControls(id?: string): void {
        this._formControlsService.setParticipentToControl(id);
        this.formControls = this._formControlsService.controls;
    }

    private _reloadSettingControls(id?: string): void {
        this._formControlsService.setParticipentSettingToControl(id);
        this.formControls = this._formControlsService.controls;
    }

    private _setControlParticipants(): void {
        const defaultParticipant = new ContactListDto();
        defaultParticipant.firstName = 'Unassigned';
        defaultParticipant.middleName = '';
        defaultParticipant.lastName = '';
        defaultParticipant.fullName = 'Unassigned';
        defaultParticipant.id = 'default';
        this.participants.push(defaultParticipant);
        if (this.participants.length > 1) {
            this._formControlsService.setControlParticipants(this.participants);
        }
        this._cdr.detectChanges();
    }

    private _setControlParticipantsSetting(): void {
        const defaultParticipant = new ParticipantMappingItemDto();
        defaultParticipant.name = 'Unassigned';
        defaultParticipant.id = 'default';
        const find = this.participantMappingItems.find((item) => item.id !== 'default');
        if (find) {
            this.participantMappingItems.push(defaultParticipant);
        }
        if (this.participantMappingItems.length > 1) {
            this._formControlsService.setControlParticipantsSetting(this.participantMappingItems);
        }
        this._cdr.detectChanges();
    }

    private _getParticipantsChange(): void {
        // Chnage participantMappingItems afte update in participant setting component
        this._participantSettingService.getParticipantsChange$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result) => {
                this.participantMappingItems = result;
                this._setControlParticipantsSetting();
            });
    }

    private _participantMargeFormsSubject(): void {
        this._participantMargeService
            .participantMargeFormsSubject$()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value: ParticipantMargeForm[]) => {
                if (
                    this.participantMargeForms
                    && this.participantMargeForms.length > 0
                    && this.showModal
                    && this.firstInit
                ) {
                    this.showMergeModal();
                    this.firstInit = false;
                }
            });
    }
}
