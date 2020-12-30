import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { SharedFormsLibraryModule } from '@app/shared/components/forms-library/shared-forms-library.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DndModule } from 'ngx-drag-drop';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { FormLibraryDocumentComponent } from './form-library-document/form-library-document.component';
import { FormsLibraryRoutingModule } from './forms-library-routing.module';
import { FormsLibraryComponent } from './forms-library/forms-library.component';
import { UploadDocumentModalComponent } from './forms-library/modals/upload-local-move-photo/upload-document-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        TableModule,
        PaginatorModule,
        FormsLibraryRoutingModule,
        DndModule,
        DragDropModule,
        MatSnackBarModule,
        UiComponentsModule,
        SharedFormsLibraryModule,
        AppBsModalModule,
        FileUploadModule,
    ],
    declarations: [
        FormsLibraryComponent,
        FormLibraryDocumentComponent,
        UploadDocumentModalComponent,
    ],
    exports: [],
    providers: [],
})
export class FormsLibraryModule { }
