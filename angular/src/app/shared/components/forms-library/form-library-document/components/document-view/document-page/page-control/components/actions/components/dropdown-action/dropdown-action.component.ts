import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { DropdownSavingData, DropdownSetting } from '@app/shared/components/forms-library/models/table-documents.model';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ControlEditDto } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PageControlDropdownActionsService } from '../../../services/page-control-dropdown-actions.service';

@Component({
    selector: 'dropdown-action',
    templateUrl: './dropdown-action.component.html',
    providers: [PageControlDropdownActionsService],
})
export class DropdownActionComponent extends AppComponentBase implements OnInit {

    @ViewChild('formOptionsRef') formOptionsElement: ElementRef;

    @Input() showDropDown: boolean;
    @Input() control: ControlEditDto;
    @Input() pageId: string;
    @Input() documentId: string;

    @Output() showDropDownChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _optionsChange: Subject<string> = new Subject<string>();
    model: string;
    options: SelectItem[] = [];
    formOptions = new FormArray([new FormControl('', Validators.required)]);

    constructor(
        injector: Injector,
        private _pageControlDropdownActions: PageControlDropdownActionsService,
        private _cdr: ChangeDetectorRef,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.control) {
            this._initSettingOptopns();
        }

        if (this.options.length) {
            this.formOptions = new FormArray([]);
            this.options.forEach((option) => {
                this.formOptions.controls.push(
                    new FormControl(option.value, Validators.required)
                );
            });
        }

        this._optionsChanged();
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
        this.showDropDownChange.emit(this.showDropDown);
    }

    public addOption(): void {
        this.formOptions.push(new FormControl('', Validators.required));
    }

    public removeOption(index: number): void {
        this.options.splice(index, 1);
        this.formOptions.removeAt(index);
    }

    public onSelectChange(event: SelectItem): void {
        this.model = event.data.type;
    }

    public onFormOptionChange(event: string): void {
        this._optionsChange.next(event);
    }

    public cancelDropDown(): void {
        const value = this.control.value ? this.control.value.value : undefined;
        if (value) {
            const find = this.options.find((item: SelectItem) => {
                return item.value === value;
            });
            this.model = find ? find.data.type : undefined;
        }
        this.toggleDropDown();
    }

    public saveDropDown(isChange?: boolean): void {
        if (isChange || this.options.length && this.options.length !== this.formOptions.controls.length) {
            this.setOptions();
        }

        if (!this.control) { return; }

        const settingOptions = this.options.map((option) => {
            return option.value;
        });

        const setting: DropdownSetting = new DropdownSetting(settingOptions, this.model);
        this.control.isRequired = this.options.length ? true : false;
        this.control.additionalSettings = JSON.stringify(setting);
        const data: DropdownSavingData = new DropdownSavingData(
            this.control.id, this.pageId, this.documentId,
            this.model ? this.options[+this.model].value : ''
        );
        this._pageControlDropdownActions.saveDropdownSetting(data)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullySaved'));
                if (!isChange) {
                    this.toggleDropDown();
                }
                this._cdr.markForCheck();
            });
    }

    public setOptions(): void {
        this.options = [];
        this.formOptions.controls.forEach((control, index) => {
            this.options.push(new SelectItem(
                control.value,
                `id_${control.value}__${index}`,
                { type: index }
            ));
        });
    }

    private _initSettingOptopns(): void {
        this.options = this._pageControlDropdownActions
            .mapSettingOptions(this.control.additionalSettings);
        this._setModel();
    }

    private _setModel(): void {
        this.model = this._pageControlDropdownActions.getModel(this.control.value, this.options);
    }

    private _optionsChanged(): void {
        this._optionsChange
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                takeUntil(this.onDestroy$)
            ).subscribe(() => {
                this.saveDropDown(true);
            });
    }
}
