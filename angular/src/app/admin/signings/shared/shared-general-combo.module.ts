import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneralComboComponent } from './general-combo/general-combo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        GeneralComboComponent,
    ],
    exports: [
        GeneralComboComponent,
    ]
})

export class SharedGeneralComboModule { }
