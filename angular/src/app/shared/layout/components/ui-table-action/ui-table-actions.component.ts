import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiTableActionItem } from './models/ui-table-action.model';

@Component({
    selector: 'ui-table-actions',
    templateUrl: './ui-table-actions.component.html'
})
export class UiTableActionsComponent {

    @Output() selected: EventEmitter<any> = new EventEmitter<any>();

    @Input() listActions: UiTableActionItem[];
    @Input() itemId: any;
    @Input() disabled = false;
    @Input() maxContent = false;

    showOptions = false;

    public toggle(): void {
        this.showOptions = !this.showOptions;
    }

    public selectOption(item: UiTableActionItem): void {
        this.itemId ? this.selected.emit({ item, id: this.itemId }) : this.selected.emit(item);
        this.showOptions = !this.showOptions;
    }

    get isDisabled(): boolean {
        if (this.listActions && !this.listActions.length) { return false; }

        return !(this.listActions.filter((item) => {
            return item.available;
        }).length);
    }
}
