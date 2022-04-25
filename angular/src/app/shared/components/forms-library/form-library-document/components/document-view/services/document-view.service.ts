import { SwitchSetting, ViewMode } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { isNumber } from 'lodash';

export class DocumentViewService {

    private _signingModalOn = false;
    formSetting: SwitchSetting = new SwitchSetting();

    get signingModalOn(): boolean {
        return this._signingModalOn;
    }
    set signingModalOn(value: boolean) {
        this._signingModalOn = value;
    }

    public getMode(layer: ControlLayer): ViewMode {
        if (!isNumber(layer)) { return; }

        let viewMode: ViewMode;
        if (this.formSetting.viewModeSettings) {
            this.formSetting.viewModeSettings.forEach((element) => {
                if (element.layer === layer) {
                    element.viewModes.forEach((item) => {
                        if (item.value) {
                            viewMode = item;
                        }
                    });
                }
            });
        }

        return viewMode;
    }
}
