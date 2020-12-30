import { Component, Injector, OnInit } from '@angular/core';
import { InputTypeComponentBase } from '../input-type-component-base';

@Component({
  selector: 'app-multiple-select-input-type',
  templateUrl: './multiple-select-combobox-input-type.component.html'
})
export class MultipleSelectComboboxInputTypeComponent extends InputTypeComponentBase implements OnInit {
  filteredValues: string[];

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.filteredValues = this.allValues;
  }

  getSelectedValues(): string[] {
    if (!this.selectedValues) {
      return [];
    }
    return this.selectedValues;
  }

  filter(event) {
    this.filteredValues = this.allValues
      .filter(item =>
        item.toLowerCase().includes(event.query.toLowerCase())
      );
  }
}

