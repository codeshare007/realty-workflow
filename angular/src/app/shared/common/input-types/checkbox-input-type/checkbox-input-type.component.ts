import { Component, OnInit, Injector } from '@angular/core';
import { InputTypeComponentBase } from '../input-type-component-base';

@Component({
  selector: 'app-checkbox-input-type',
  templateUrl: './checkbox-input-type.component.html',
  styleUrls: ['./checkbox-input-type.component.css']
})
export class CheckboxInputTypeComponent extends InputTypeComponentBase implements OnInit {
  checked: boolean;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.checked = this.selectedValues && this.selectedValues[0] && this.selectedValues[0] === 'true';
  }

  getSelectedValues(): string[] {
    return [this.checked.toString()];
  }
}
