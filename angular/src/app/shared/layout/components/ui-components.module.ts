import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { UiMultiSelectPipe } from './ui-multi-select/pipes/ui-multi-select.pipe';
import { UiMultiSelectComponent } from './ui-multi-select/ui-multi-select.component';
import { UiSelectComponent } from './ui-select/ui-select.component';
import { UiTableActionsPipe } from './ui-table-action/pipes/ui-table-actions.pipe';
import { UiTableActionsComponent } from './ui-table-action/ui-table-actions.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        UtilsModule,
    ],
    declarations: [
        UiTableActionsComponent,
        UiSelectComponent,
        UiMultiSelectComponent,

        UiTableActionsPipe,
        UiMultiSelectPipe,
    ],
    exports: [
        UiTableActionsComponent,
        UiSelectComponent,
        UiMultiSelectComponent,

        UiMultiSelectPipe,
    ],
    providers: [
    ]
})
export class UiComponentsModule { }
