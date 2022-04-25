import { ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { DropdownSavingData, TypeIndex } from '@app/shared/components/forms-library/models/table-documents.model';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto, ControlValueDto } from '@shared/service-proxies/service-proxies';
import { isEmpty } from 'lodash';
import { delay, takeUntil } from 'rxjs/operators';
import { SigningService } from 'signing/services/signing.service';
import { ControlDetailsService } from '../../../../../form-controls/services/control-details.service';
import { PageControlDropdownActionsService } from '../services/page-control-dropdown-actions.service';

@Component({
    selector: 'dropdown-control',
    templateUrl: './dropdown-control.component.html',
    providers: [PageControlDropdownActionsService],
})
export class DropdownControlComponent extends AppComponentBase implements OnInit {

    @ViewChild('dropdownControl') dropdownControlRef: ElementRef;

    @Input() control: ControlEditDto;
    @Input() tabIndex: number;
    @Input() documentId: string;
    @Input() pageId: string;
    @Input() participantId: string;
    @Input() publicMode = false;

    model: string;
    optionsList: SelectItem[] = [];

    constructor(
        injector: Injector,
        private _pageControlDropdownActions: PageControlDropdownActionsService,
        private _cdr: ChangeDetectorRef,
        private _signingService: SigningService,
        private _controlDetailsService: ControlDetailsService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.control) {
            this._initOptopnsList();
        }

        if (this.publicMode) {
            this._setFocusControl();
        }
    }

    public onSelectChange(event: SelectItem): void {
        const data: DropdownSavingData = new DropdownSavingData(
            this.control.id, this.pageId, this.documentId, event.value
        );
        this._pageControlDropdownActions.saveDropdownSetting(data)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                const input: ControlValueDto = new ControlValueDto()
                input.value = data.value;
                this.control.value = input;
                this._setFilledProgress();
                this._cdr.markForCheck();
            });
    }

    private _initOptopnsList(): void {
        this.optionsList = this._pageControlDropdownActions
            .mapSettingOptions(this.control.additionalSettings);
        this._setModel();
    }

    private _setModel(): void {
        this.model = this._pageControlDropdownActions
            .getModel(this.control.value, this.optionsList);
        if (!isEmpty(this.model)) {
            this._setFilledProgress();
        }
    }

    private _setFilledProgress(): void {
        this._signingService.setFilledProgress(this.control, this.participantId);
    }

    private _setFocusControl(): void {
        this._signingService.getTabChange$()
            .pipe(
                delay(300),
                takeUntil(this.onDestroy$)
            ).subscribe((type: TypeIndex) => {
                if (this.tabIndex === (this._signingService.focusStartedControl)) {
                    this.dropdownControlRef.nativeElement.focus();
                    this.dropdownControlRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    this._controlDetailsService.selectControlDetails(this.control);
                    this._cdr.markForCheck();
                }
            });
    }
}
