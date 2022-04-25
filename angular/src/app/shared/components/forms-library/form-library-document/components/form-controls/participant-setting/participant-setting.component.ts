import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { ParticipantFormControl } from '@app/shared/components/forms-library/models/table-documents.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlLayer, ParticipantMappingItemDto, ParticipantMappingItemsInput } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ParticipantClassPipe } from '../../document-view/document-page/pipes/participant-class.pipe';
import { FormControlsService } from '../services/form-controls.service';
import { ParticipantSettingService } from '../services/participant-setting.service';


@Component({
    selector: 'participant-setting',
    templateUrl: './participant-setting.component.html',
    providers: [ParticipantClassPipe]
})
export class ParticipantSettingComponent extends AppComponentBase implements OnInit, OnChanges {

    @ViewChild('formParticipantsSetting') formParticipantsSettingElement: ElementRef;

    @Input() title: string;
    @Input() isAction: boolean;
    @Input() participantId: string;
    @Input() formId: string;
    @Input() mainId: string;
    @Input() mainLayer: ControlLayer;
    @Input() participantMappingItems: ParticipantMappingItemDto[] = [];

    @Output() selectedParticipantSetting: EventEmitter<ParticipantMappingItemsInput> = new EventEmitter<ParticipantMappingItemsInput>();

    formParticipantsSetting = new FormArray([new ParticipantFormControl('', Validators.required)]);
    showDropDown = false;
    participantActionValue = 'Unassigned';
    selectParticipant: ParticipantMappingItemsInput = new ParticipantMappingItemsInput();
    private _participantChange: Subject<string> = new Subject<string>();

    get participants(): ParticipantMappingItemsInput[] {
        return this._participantSettingService.participants;
    }

    constructor(
        injector: Injector,
        private _cdr: ChangeDetectorRef,
        private _formControlsService: FormControlsService,
        private _participantClassPipe: ParticipantClassPipe,
        private _participantSettingService: ParticipantSettingService,
    ) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.participantMappingItems && this.participantMappingItems.length) {
            this._init();
        }
    }

    ngOnInit(): void {
        if (!this.isAction) {
            this._participantChanged();
        }
    }

    private _init(): void {
        this.formParticipantsSetting = new FormArray([]);
        this.participantMappingItems.forEach((participant) => {
            if (participant.id !== 'default') {
                const input = new ParticipantFormControl(participant.name, Validators.required);
                input.participantId = participant.id;
                this.formParticipantsSetting.controls.push(input);
            }
        });
        this._participantSettingService.mapParticipantDto(this.participantMappingItems);
        this._selectedParticipant();
    }

    public onParticipantChange(event): void {
        this._participantChange.next(event);
    }

    public addOption(): void {
        this.formParticipantsSetting.push(new ParticipantFormControl('', Validators.required));
    }

    public removeOption(index: number): void {
        const item = this.formParticipantsSetting.controls[index];
        const findIndex = this.participants.findIndex((participant) => {
            return item ? item.value === participant.name : false;
        });
        if (findIndex !== -1) {
            this.participants.splice(findIndex, 1);
            this.formParticipantsSetting.removeAt(index);
            this._updateParticipant();
        }
    }

    public getParticipantClass(participant: ParticipantMappingItemsInput): string {
        if (!participant) { return; }

        return this._participantClassPipe.transform(
            participant.id, this._formControlsService.controlParticipantsSetting
        );
    }

    public selectValue(value: ParticipantMappingItemsInput) {
        if (!value) { return; }

        this.selectParticipant = value;
        this.participantActionValue = `${value.name}`;
        this.showDropDown = false;
        if (value.id !== 'default') {
            this.selectedParticipantSetting.emit(this.selectParticipant);
        } else {
            this.selectedParticipantSetting.emit(null);
        }
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    private _setParticipantActionValue(): void {
        const find = this._participantSettingService.participants.find((item) => {
            return item.name === this.participantActionValue;
        });
        this.participantActionValue = find ? find.name : 'Unassigned';
        this._cdr.detectChanges();
    }

    private _selectedParticipant(): void {
        const findDefault = this._participantSettingService.participants.find((item) => {
            return item.id === (this.participantId ? this.participantId : 'default');
        });
        this.selectParticipant = findDefault
            ? findDefault
            : this._participantSettingService
                .participants.find((item) => {
                    return item.id === 'default';
                });
        this.participantActionValue = `${this.selectParticipant.name}`;
    }

    private _participantChanged(): void {
        this._participantChange
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                takeUntil(this.onDestroy$)
            ).subscribe(() => {
                this._mapParticipantSetting();
            });
    }

    private _mapParticipantSetting(): void {
        this._participantSettingService.mapParticipant(this.formParticipantsSetting.controls);
        this._updateParticipant();
    }

    private _updateParticipant(): void {
        this._participantSettingService.updateParticipantsSetting(this.formId, this.mainId, this.mainLayer)
            .subscribe((result: ParticipantMappingItemDto[]) => {
                this._participantSettingService.mapParticipantDto(result);
                this._setParticipantActionValue();
                this.notify.success(this.l('SuccessfullySaved'));
                this._cdr.markForCheck();
            });
    }
}
