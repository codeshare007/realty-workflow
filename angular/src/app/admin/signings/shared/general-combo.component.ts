import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'general-combo',
    template:
        `<select
        class="form-control"
        [disabled]="disabled"
        [(ngModel)]="selectedValue"
        (ngModelChange)="selectedValueChange.emit($event)">
              <option *ngIf="undefinedLabel != undefined" value="" selected="true">{{ undefinedLabel }}</option>
            <option *ngFor="let item of values" [disabled]="item.disabled" [value]="item.value">{{item.label}}</option>
    </select>`
})
export class GeneralComboComponent extends AppComponentBase {

    @Input() undefinedLabel: string = undefined;
    @Input() selectedValue: number = undefined;
    @Output() selectedValueChange: EventEmitter<number> = new EventEmitter<number>();
    @Input() disabled: false;
    @Input() required: false;

    @Input() values: SelectListItem[];

    constructor(
        injector: Injector) {
        super(injector);
    }
}

export class SelectListItem {
    public value: any;
    public label: string;
    public disabled = false;

    constructor(value: any, label: string, disabled = false) {
        this.value = value;
        this.label = label;
        this.disabled = disabled;
    }
}

export class SelectListItemExt extends SelectListItem {
    public description: string;

    constructor(value: any, label: string, description: string) {
        super(value, label);
        this.description = description;
    }
}

export class CheckListItem extends SelectListItem {
    public checked: boolean;

    constructor(value: any, label: string, checked: boolean) {
        super(value, label);
        this.checked = checked;
    }
}
