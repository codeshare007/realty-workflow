import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'password-input-with-show-button',
    templateUrl: './password-input-with-show-button.component.html'
})
export class PasswordInputWithShowButtonComponent {
    @Input() data: string;
    @Output() dataChange = new EventEmitter();
    isVisible = false;

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
    }

    onChange() {
        this.dataChange.emit(this.data);
    }
}
