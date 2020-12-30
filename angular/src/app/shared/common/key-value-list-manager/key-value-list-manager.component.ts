import {Component, Injector, Input} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import * as _ from 'lodash';

@Component({
    selector: 'key-value-list-manager',
    templateUrl: './key-value-list-manager.component.html',
    styleUrls: ['./key-value-list-manager.component.css']
})
export class KeyValueListManagerComponent extends AppComponentBase {
    @Input() header: string;
    @Input() keyPlaceHolder: string;
    @Input() valuePlaceHolder: string;
    @Input() items: { key: string, value: string }[];

    addOrEditKey = '';
    addOrEditValue = '';

    isEdit = false;

    constructor(injector: Injector) {
        super(injector);
        if (!this.items) {
            this.items = [];
        }

        if (!this.keyPlaceHolder) {
            this.l('Key');
        }

        if (!this.valuePlaceHolder) {
            this.l('Value');
        }
    }

    onKeyChange() {
        let itemIndex = _.findIndex(this.items, item => item.key === this.addOrEditKey);
        this.isEdit = itemIndex !== -1;
        if (this.isEdit) {
            this.addOrEditValue = this.items[itemIndex].value;
        }
    }

    openItemEdit(keyValueItem: { key: string; value: string }) {
        this.addOrEditKey = keyValueItem.key;
        this.addOrEditValue = keyValueItem.value;

        this.isEdit = true;
    }

    removeItem(keyValueItem: { key: string; value: string }) {
        _.remove(this.items, (item) => item.key === keyValueItem.key);
        this.onKeyChange();
    }

    addOrEdit() {
        if (!this.addOrEditKey || !this.addOrEditValue) {
            return;
        }

        let newItem = {
            key: this.addOrEditKey,
            value: this.addOrEditValue
        };

        let indexOfItemInArray = _.findIndex(this.items, item => item.key === newItem.key);
        if (indexOfItemInArray !== -1) {//edit
            this.items.splice(indexOfItemInArray, 1, newItem);
        } else {
            this.items.push(newItem);
        }

        this.addOrEditKey = '';
        this.addOrEditValue = '';
    }

    getItems(): { key: string, value: string }[] {
        return this.items;
    }
}
