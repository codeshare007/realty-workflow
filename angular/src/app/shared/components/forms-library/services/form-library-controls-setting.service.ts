import { SwitchSetting, ViewMode, ViewModeSetting, ViewModesType } from '@app/shared/components/forms-library/models/table-documents.model';
import { ControlEditDto, ControlLayer, FormEditDto, PageEditDto } from '@shared/service-proxies/service-proxies';
import { cloneDeep, isArray, isNumber, some } from 'lodash';

export class FormLibraryControlsSettingService {

    public isLibrary: boolean;
    public isTransaction: boolean;
    public isSigning: boolean;
    private isFirstChange = false;

    private _viewModes: ViewMode[] = [
        new ViewMode('Edit', ViewModesType.Edit),
        new ViewMode('Populate', ViewModesType.Populate, true),
        new ViewMode('View', ViewModesType.View),
    ];

    private _viewModeSettings: ViewModeSetting[] = [
        new ViewModeSetting(ControlLayer.Library, cloneDeep(this._viewModes)),
        new ViewModeSetting(ControlLayer.Transaction, cloneDeep(this._viewModes)),
        new ViewModeSetting(ControlLayer.Signing, cloneDeep(this._viewModes)),
    ];

    private _settings: SwitchSetting = {
        allowSwitchMode: true,
        viewModeSettings: this._viewModeSettings,
    };

    public getSetting(document: FormEditDto | FormEditDto[], layer?: ControlLayer, changeMode?: ViewModesType): SwitchSetting {
        this._getAllowedLayers(document);

        this._settings.viewModeSettings = this._settings.viewModeSettings
            .filter((item) => {
                return this.isLibrary && item.layer === ControlLayer.Library
                    || this.isTransaction && item.layer === ControlLayer.Transaction
                    || this.isSigning && item.layer === ControlLayer.Signing;
            });

        if (isNumber(layer) && isNumber(changeMode) && !this.isFirstChange) {
            this.isFirstChange = true;
            this._changeLayerMode(layer, changeMode);
        }

        return this._settings;
    }

    private _getAllowedLayers(document: FormEditDto | FormEditDto[]) {
        if (isArray(document)) {
            document.forEach((element) => {
                this._checkPagesControl(element);
            });
        } else {
            this._checkPagesControl(document);
        }
    }

    private _checkPagesControl(document: FormEditDto): void {
        document.pages.forEach((page: PageEditDto) => {
            if (this.isLibrary && this.isTransaction && this.isSigning) { return; }
            this.isLibrary = this.isLibrary
                ? this.isLibrary
                : some(page.controls, (control: ControlEditDto) => control.layer === ControlLayer.Library);
            this.isTransaction = this.isTransaction
                ? this.isTransaction
                : some(page.controls, (control: ControlEditDto) => control.layer === ControlLayer.Transaction);
            this.isSigning = this.isSigning
                ? this.isSigning
                : some(page.controls, (control: ControlEditDto) => control.layer === ControlLayer.Signing);
        });
    }

    private _changeLayerMode(layer: ControlLayer, changeMode: ViewModesType): void {
        this._settings.viewModeSettings
            .forEach((viewMode: ViewModeSetting) => {
                if (viewMode.layer === layer) {
                    viewMode.viewModes.forEach((mode: ViewMode) => {
                        if (mode.type === changeMode) {
                            mode.value = true;
                        } else {
                            mode.value = false;
                        }
                    });
                }
            });
    }
}
