import { AppConsts } from '@shared/AppConsts';
import { AccessSettingType, AccessTypeItem, ControlValueInput } from '../../models/table-documents.model';

export class FormUrlService {

    // private _accessSettingType: AccessSettingType;
    private _accessTypeItem: AccessTypeItem;
    private _controlInput: ControlValueInput = new ControlValueInput();
    controlUrl = AppConsts.remoteServiceBaseUrl + '/FormControl/UpdateControlValue';
    uploadUrl = AppConsts.remoteServiceBaseUrl + '/FormControl/CreateAttachment'; //Async';

    get accessTypeItem(): AccessTypeItem {
        return this._accessTypeItem;
    }
    set accessTypeItem(value: AccessTypeItem) {
        this._accessTypeItem = value;
    }
    get controlInput(): ControlValueInput {
        return this._controlInput;
    }
    set controlInput(value: ControlValueInput) {
        this._controlInput = value;
    }

    public getControlInput(): ControlValueInput {
        this.controlInput = new ControlValueInput();
        switch (this.accessTypeItem.type) {
            case AccessSettingType.FormLibrary:
                this.controlInput.libraryId = this.accessTypeItem.id;
                break;
            case AccessSettingType.TransactionFormDesign:
                this.controlInput.transactionId = this.accessTypeItem.id;
                break;
            case AccessSettingType.SigningFormDesign:
                this.controlInput.signingId = this.accessTypeItem.id;
                break;
            case AccessSettingType.ParticipantCode:
                this.controlInput.participantCode = this.accessTypeItem.id;
                break;
        }

        return this.controlInput;
    }
}
