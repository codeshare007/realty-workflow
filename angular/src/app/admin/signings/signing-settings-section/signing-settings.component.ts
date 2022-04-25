import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, ReminderFrequency, SigningSettingsDto } from '@shared/service-proxies/service-proxies';
import { isUndefined } from 'lodash';
import * as moment from 'moment';
import { ReminderFrequencyTypeToNameService } from './services/reminder-frequency-type-to-name.service';

@Component({
    selector: 'signing-settings',
    templateUrl: './signing-settings.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class SigningSettingsComponent extends AppComponentBase implements OnInit, OnChanges {

    @Input() settings: SigningSettingsDto;
    @Input() disabled: boolean;
    @Output() settingsChange: EventEmitter<SigningSettingsDto> = new EventEmitter<SigningSettingsDto>();

    reminderFrequencies = [
        this._frequencyToCombobox(ReminderFrequency.Never),
        this._frequencyToCombobox(ReminderFrequency.EachHour),
        this._frequencyToCombobox(ReminderFrequency.Each2Hours),
        this._frequencyToCombobox(ReminderFrequency.Each4Hours),
        this._frequencyToCombobox(ReminderFrequency.Each6Hours),
        this._frequencyToCombobox(ReminderFrequency.Each12Hours),
        this._frequencyToCombobox(ReminderFrequency.Each24Hours),
        this._frequencyToCombobox(ReminderFrequency.Each32Hours),
        this._frequencyToCombobox(ReminderFrequency.Each48Hours),
    ];

    expirationDate: moment.Moment;

    constructor(
        injector: Injector,
        private _frequencyTypeToNameService: ReminderFrequencyTypeToNameService
    ) {
        super(injector);
    }

    ngOnInit() {
        if (!isUndefined(this.settings)) {
            this.expirationDate = this.settings.expirationSettings.expirationDate;
        }
    }

    ngOnChanges({ disabled }: SimpleChanges): void {
        if (disabled && disabled.currentValue !== disabled.previousValue && this.settings) {
            this.expirationDate = this.settings.expirationSettings.expirationDate
                ? moment(this.settings.expirationSettings.expirationDate)
                : undefined;
        }
    }

    public deleteDate(): void {
        this.expirationDate = undefined;
        this.expirationDateSet(this.expirationDate);
    }

    dispatchingFrequencySelected(selectedValue: string): void {
        this.settings.reminderSettings.dispatchingFrequency = this._stringToNumber(selectedValue);
        this.settingsChange.emit(this.settings);
    }

    expirationDateSet(event): void {
        this.settings.expirationSettings.expirationDate = event;
        this.settingsChange.emit(this.settings);
    }

    private _frequencyToName(frequency: ReminderFrequency): string {
        return this._frequencyTypeToNameService.getName(frequency);
    }

    private _frequencyToCombobox(frequency: ReminderFrequency): ComboboxItemDto {
        return new ComboboxItemDto({
            displayText: this._frequencyToName(frequency),
            isSelected: false,
            value: '' + frequency
        });
    }

    private _stringToNumber(value: string): number {
        return isNaN(Number(value)) ? 0 : +value;
    }
}
