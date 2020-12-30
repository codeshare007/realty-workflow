import { Injectable } from '@angular/core';
import { SingleLineStringInputTypeComponent } from './single-line-string-input-type/single-line-string-input-type.component';
import { CheckboxInputTypeComponent } from './checkbox-input-type/checkbox-input-type.component';
import { ComboboxInputTypeComponent } from './combobox-input-type/combobox-input-type.component';
import { InputTypeComponentBase } from './input-type-component-base';
import { IInputType } from '@shared/service-proxies/service-proxies';
import { MultipleSelectComboboxInputTypeComponent } from './multiple-select-combobox-input-type/multiple-select-combobox-input-type.component';

export class InputTypeConfigurationDefinition {
  name: string;
  component: InputTypeComponentBase;
  hasValues: boolean;
  constructor(name: string, component: any, hasValues: boolean) {
    this.name = name;
    this.component = component;
    this.hasValues = hasValues;
  }
}

@Injectable({
  providedIn: 'root'
})
export class InputTypeConfigurationService {
  InputTypeConfigurationDefinitions: InputTypeConfigurationDefinition[];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    let singleLineStringInputType = new InputTypeConfigurationDefinition(
      'SINGLE_LINE_STRING',
      SingleLineStringInputTypeComponent,
      false
    );

    let checkboxInputType = new InputTypeConfigurationDefinition(
      'CHECKBOX',
      CheckboxInputTypeComponent,
      false
    );

    let comboboxInputType = new InputTypeConfigurationDefinition(
      'COMBOBOX',
      ComboboxInputTypeComponent,
      true
    );

    let multipleselectComboBoxInputType = new InputTypeConfigurationDefinition(
      'MULTISELECTCOMBOBOX',
      MultipleSelectComboboxInputTypeComponent,
      true
    );

    this.InputTypeConfigurationDefinitions = [];
    this.InputTypeConfigurationDefinitions.push(singleLineStringInputType);
    this.InputTypeConfigurationDefinitions.push(checkboxInputType);
    this.InputTypeConfigurationDefinitions.push(comboboxInputType);
    this.InputTypeConfigurationDefinitions.push(multipleselectComboBoxInputType);
  }

  getByName(name: string): InputTypeConfigurationDefinition {
    let definition = this.InputTypeConfigurationDefinitions.filter(definition => definition.name === name);
    if (definition && definition.length === 1) {
      return definition[0];
    }
    return null;
  }

  getByInputType(inputType: IInputType): InputTypeConfigurationDefinition {
    return this.getByName(inputType.name);
  }
}

