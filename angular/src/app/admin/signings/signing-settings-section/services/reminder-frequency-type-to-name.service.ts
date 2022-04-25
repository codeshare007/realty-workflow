import { Injectable } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppConsts } from '@shared/AppConsts';
import { ReminderFrequency } from '@shared/service-proxies/service-proxies';

@Injectable()
export class ReminderFrequencyTypeToNameService {

    private _localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    constructor(private _appLocalizationSerivce: AppLocalizationService) {
    }

    getName(value: number): any {
        const namesMap = {
            [ReminderFrequency.Never]:          'Not Applied',
            [ReminderFrequency.EachHour]:       'Every 1 hour',
            [ReminderFrequency.Each2Hours]:     'Every 2 hours',
            [ReminderFrequency.Each4Hours]:     'Every 4 hours',
            [ReminderFrequency.Each6Hours]:     'Every 6 hours',
            [ReminderFrequency.Each12Hours]:    'Every 12 hours',
            [ReminderFrequency.Each24Hours]:    'Every 24 hours',
            [ReminderFrequency.Each32Hours]:    'Every 32 hours',
            [ReminderFrequency.Each48Hours]:    'Every 48 hours',
        };

        for (let key in namesMap) {
            if (namesMap.hasOwnProperty(key) && this.isValueEqualToType(value, Number(key))) {
                return namesMap[key];
            }
        }

        return undefined;
    }

    private isValueEqualToType(value: number, type: number) {
        // tslint:disable-next-line:no-bitwise
        return type === value;
    }

    private l(key: string): string {
        return this._appLocalizationSerivce.localize(key, this._localizationSourceName);
    }
}
