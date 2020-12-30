import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector } from '@angular/core';
import { SelectedValuesOptions, AllValuesOptions, ComponentInstanceOptions } from './InputTypeConsts';

export abstract class InputTypeComponentBase extends AppComponentBase {
    selectedValues: string[];
    allValues: string[];
    abstract getSelectedValues(): string[];

    constructor(
        injector: Injector
    ) {
        super(injector);
        this.selectedValues = injector.get<string[]>(SelectedValuesOptions);
        this.allValues = injector.get<string[]>(AllValuesOptions);
        (injector.get(ComponentInstanceOptions) as any)(this);
    }
}
