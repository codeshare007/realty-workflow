import { Injectable } from '@angular/core';
import { ControlValueInput, DropdownSavingData, DropdownSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { FormUrlService } from '@app/shared/components/forms-library/services/http/form-url.service';
import { HttpService } from '@app/shared/components/forms-library/services/http/http.service';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { ControlValueDto, LibraryFormServiceProxy } from '@shared/service-proxies/service-proxies';
import { get } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class PageControlDropdownActionsService {

    constructor(
        private _libraryFormService: LibraryFormServiceProxy,
        private _httpService: HttpService,
        private _formUrlService: FormUrlService,
    ) { }

    public mapSettingOptions(setting: string): SelectItem[] {
        const options: SelectItem[] = [];
        if (setting) {
            const jsonSetting: DropdownSetting = JSON.parse(setting);
            const settingsList: string[] = jsonSetting ? jsonSetting.options : [];

            if (settingsList.length) {
                settingsList.forEach((setting: string, index: number) => {
                    options.push(new SelectItem(
                        setting,
                        `id_${setting}__${index}`,
                        { type: index }
                    ));
                });
            }
        }

        return options;
    }

    public getModel(data: ControlValueDto, options: SelectItem[]): string {
        const value = get(data, 'value') ? data.value : undefined;
        let findModel;
        if (value) {
            findModel = options.findIndex((option) => {
                return option.value === value;
            });
        }
        return findModel !== -1 ? findModel : undefined;
    }

    public saveDropdownSetting(dropdownSetting: DropdownSavingData): Observable<void> {
        const { controlId, pageId, documentId, value } = dropdownSetting;
        const input: ControlValueInput = this._formUrlService.getControlInput();
        input.controlId = controlId;
        input.formId = documentId;
        input.pageId = pageId;
        input.value = value;

        return this._httpService.post(this._formUrlService.controlUrl, input);
    }
}
