import { InjectionToken } from '@angular/core';

export const SelectedValuesOptions = new InjectionToken<string[]>('selectedValues');
export const AllValuesOptions = new InjectionToken<string[]>('allValues');
export const ComponentInstanceOptions = new InjectionToken<string[]>('componentInstance');
