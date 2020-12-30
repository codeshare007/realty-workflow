import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, CommonLookupServiceProxy, UpdateEditionDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { finalize } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


@Component({
    selector: 'editEditionModal',
    templateUrl: './edit-edition-modal.component.html'
})
export class EditEditionModalComponent extends AppComponentBase {

    @ViewChild('editModal', {static: true}) modal: ModalDirective;
    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    currencyMask = createNumberMask({
        prefix: '',
        allowDecimal: true
    });

    edition: UpdateEditionDto = new UpdateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = false;
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    show(editionId?: number): void {
        this.active = true;

        this._commonLookupService.getEditionsForCombobox(true).subscribe(editionsResult => {
            this._editionService.getEditionForEdit(editionId).subscribe(editionResult => {
                this.featureTree.editData = editionResult;
                this.edition.edition = editionResult.edition;
                this.modal.show();
            });
        });
    }

    onShown(): void {
        document.getElementById('EditionDisplayName').focus();
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        const input = new UpdateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.updateEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
