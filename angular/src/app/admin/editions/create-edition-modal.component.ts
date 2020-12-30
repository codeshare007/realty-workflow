import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, CommonLookupServiceProxy, CreateEditionDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { finalize } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


@Component({
    selector: 'createEditionModal',
    templateUrl: './create-edition-modal.component.html'
})
export class CreateEditionModalComponent extends AppComponentBase {

    @ViewChild('createModal', {static: true}) modal: ModalDirective;
    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    currencyMask = createNumberMask({
        prefix: '',
        allowDecimal: true
    });

    edition: CreateEditionDto = new CreateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = true;
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
            this.expiringEditions = editionsResult.items;
            this.expiringEditions.unshift(new ComboboxItemDto({ value: null, displayText: this.l('NotAssigned'), isSelected: true }));

            this._editionService.getEditionForEdit(editionId).subscribe(editionResult => {
                this.featureTree.editData = editionResult;
                this.modal.show();
            });
        });
    }

    onShown(): void {
        document.getElementById('EditionDisplayName').focus();
    }

    resetPrices(isFree) {
        this.edition.edition.annualPrice = undefined;
        this.edition.edition.monthlyPrice = undefined;
    }

    removeExpiringEdition(isDeactivateTenant) {
        this.edition.edition.expiringEditionId = null;
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }

        const input = new CreateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.createEdition(input)
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
