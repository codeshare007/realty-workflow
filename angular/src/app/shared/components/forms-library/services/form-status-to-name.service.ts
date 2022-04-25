import { Injectable } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppConsts } from '@shared/AppConsts';
import { FormStatus } from '@shared/service-proxies/service-proxies';

@Injectable()
export class FormStatusToNameService {

    private _localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    constructor(private _appLocalizationSerivce: AppLocalizationService) {
    }

    getName(value: number): any {
        const namesMap = {
            [FormStatus.New]: this.l('FormStatus_New'),
            [FormStatus.Processing ]: this.l('FormStatus_Processing'),
            [FormStatus.Ready ]: this.l('FormStatus_Ready'),
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
