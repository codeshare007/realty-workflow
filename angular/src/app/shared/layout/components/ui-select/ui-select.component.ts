import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SelectItem } from './models/ui-select.model';

@Component({
    selector: 'ui-select',
    templateUrl: './ui-select.component.html',
})
export class UiSelectComponent implements OnChanges {

    @Input() uiList: SelectItem[] = [];
    @Input() model: any;
    @Input() title: string;
    @Input() resetSelect: boolean;
    @Input() disabled: boolean;
    @Input() isTogle = true;

    @Output() selected: EventEmitter<SelectItem> = new EventEmitter<SelectItem>();

    showDropDown = false;
    selectLabel = 'Select';
    selectItem: SelectItem;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.uiList
            && this._isValueChanges(changes) || changes.resetSelect
        ) {
            this._initValue();
        }
    }

    public selectValue(value: SelectItem) {
        if (!value) { return; }

        this.selectItem = value;
        this.selectLabel = `${value.value}`;
        this.selected.emit(this.selectItem);
        // setTimeout(() => {
            if (this.isTogle) {
                this.toggleDropDown();
            }
        // });
    }

    public toggleDropDown(): void {
        if (!this.disabled) {
            this.showDropDown = !this.showDropDown;
        }
    }

    private _isValueChanges(changes: SimpleChanges): boolean {
        return changes.uiList.currentValue !== changes.uiList.previousValue;
    }

    private _initValue(): void {
        const find = this.uiList.find((item: SelectItem) => {
            return item.data.type === this.model;
        });
        if (find) {
            this.selectItem = find;
            this.selectLabel = find.value;
        }
    }
}
