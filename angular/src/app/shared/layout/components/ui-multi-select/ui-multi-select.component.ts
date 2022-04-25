import { BooleanInput } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { isUndefined } from 'lodash';
import { SelectItem } from '../ui-select/models/ui-select.model';

@Component({
    selector: 'ui-multi-select',
    templateUrl: './ui-multi-select.component.html'
})
export class UiMultiSelectComponent implements OnChanges {

    @Input() uiList: SelectItem[] = [];
    @Input() title: string;
    @Input() model: string[] = [];
    @Input() disabled = false;

    @Output() selected: EventEmitter<SelectItem[]> = new EventEmitter<SelectItem[]>();

    showDropDown = false;
    selectedList: SelectItem[] = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.model && this.model && this.model.length) {
            this.selectedList = this.uiList
                .filter((item) => {
                    return this.model.includes(item.data.type);
                });

            return;
        }

        this.selectedList = [];
    }

    public toggleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    public selectValue(value: SelectItem) {
        if (!value) { return; }

        this._selectedItem(value);
    }

    public isSelected(value: SelectItem): BooleanInput {
        return !isUndefined(
            this.selectedList.find(
                (item) => item.id === value.id)
        );
    }

    private _selectedItem(value: SelectItem): void {
        if (value.id === 'id-select-item__0') {
            this._emitDefaultItem(value);

            return;
        }

        this._removeDefaultItem();
        this._editSelectedList(value);
    }

    private _removeDefaultItem(): void {
        const anyIndex = this.selectedList.findIndex((item) => {
            return item.id === 'id-select-item__0';
        });
        if (anyIndex !== -1) {
            this.selectedList.splice(anyIndex, 1);
        }
    }

    private _editSelectedList(value: SelectItem): void {
        const findIndex = this.selectedList.findIndex((item) => {
            return item.id === value.id;
        });

        if (findIndex !== -1) {
            this.selectedList.splice(findIndex, 1);
        } else {
            this.selectedList.push(value);
        }
        this.selected.emit(this.selectedList);
    }

    private _emitDefaultItem(value: SelectItem): void {
        this.selectedList = [value];
        this.selected.emit(this.selectedList);
        this.showDropDown = false;
    }
}
