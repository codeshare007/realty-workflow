import { Component, OnInit, Injector } from '@angular/core';
import { InputTypeComponentBase } from '../input-type-component-base';

@Component({
  selector: 'app-single-line-string-input-type',
  templateUrl: './single-line-string-input-type.component.html',
  styleUrls: ['./single-line-string-input-type.component.css']
})
export class SingleLineStringInputTypeComponent extends InputTypeComponentBase implements OnInit {
  selectedValue: string;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  getSelectedValues(): string[] {
    if (!this.selectedValue) {
      return [];
    }
    return [this.selectedValue];
  }

  ngOnInit(): void {
    this.selectedValue = this.selectedValues[0];
  }
}
