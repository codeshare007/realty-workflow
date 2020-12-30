import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
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

        UiTableActionsPipe,
    ],
    exports: [
        UiTableActionsComponent,
    ],
    providers: [
    ]
})
export class UiComponentsModule { }
