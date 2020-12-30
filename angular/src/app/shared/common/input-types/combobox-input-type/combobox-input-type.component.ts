import { Component, OnInit, Injector } from '@angular/core';
import { InputTypeComponentBase } from '../input-type-component-base';

@Component({
  selector: 'app-combobox-input-type',
  templateUrl: './combobox-input-type.component.html',
  styleUrls: ['./combobox-input-type.component.css']
})
export class ComboboxInputTypeComponent extends InputTypeComponentBase implements OnInit {
  selectedValue: string;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.selectedValue = this.selectedValues[0];
  }

  getSelectedValues(): string[] {
    if (!this.selectedValue) {
      return [];
    }
    return [this.selectedValue];
  }
}
