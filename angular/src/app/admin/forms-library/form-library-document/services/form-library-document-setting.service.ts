import { SwitchSetting, ViewMode, ViewModeSetting, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlLayer } from '@shared/service-proxies/service-proxies';
import { cloneDeep } from 'lodash';

export class FormLibraryDocumentSettingService {

    private _viewModes: ViewMode[] = [
        new ViewMode('Edit Mode', ViewModesType.Edit, true),
        new ViewMode('Populate Mode', ViewModesType.Populate),
        new ViewMode('View Mode', ViewModesType.View),
    ];

    private _viewModeSettings: ViewModeSetting[] = [
        new ViewModeSetting(ControlLayer.Form, cloneDeep(this._viewModes)),
        new ViewModeSetting(ControlLayer.Signing, cloneDeep(this._viewModes)),
    ]

    public settings: SwitchSetting  = {
        allowSwitchMode: true,
        viewModeSettings: this._viewModeSettings,
    }
}
