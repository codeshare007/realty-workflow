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
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DndModule } from 'ngx-drag-drop';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { GeneralComboStringComponent } from './shared/general-combo-string.component';
import { GeneralComboComponent } from './shared/general-combo.component';
import { CreateEditContactModalComponent } from './signing-contacts-section/create-edit-contact-modal/create-edit-contact-modal.component';
import { SigningContactsComponent } from './signing-contacts-section/signing-contacts/signing-contacts.component';
import { SigningFormDesignComponent } from './signing-form-design/signing-form-design-page.component';
import { UploadDocumentModalComponent } from './signing-forms-section/modals/upload-document-modal/upload-document-modal.component';
import { SigningFormsTableComponent } from './signing-forms-section/signing-forms-table/signing-forms-table.component';
import { SigningGeneralSectionComponent } from './signing-page/signing-general-info-section/signing-general-info-section.component';
import { SigningPageComponent } from './signing-page/signing-page.component';
import { SigningsRoutingModule } from './signings-routing.module';
import { SigningsComponent } from './signings/signings.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        TableModule,
        PaginatorModule,
        SigningsRoutingModule,
        DndModule,
        DragDropModule,
        MatSnackBarModule,
        UiComponentsModule,
        SharedFormsLibraryModule,
        AppBsModalModule,
        FileUploadModule,
        TabsModule,
    ],
    declarations: [
        SigningsComponent,
        SigningGeneralSectionComponent,
        GeneralComboStringComponent,
        GeneralComboComponent,
        SigningContactsComponent,
        CreateEditContactModalComponent,
        SigningFormsTableComponent,
        UploadDocumentModalComponent,
        SigningFormDesignComponent,
        SigningPageComponent,
    ],
    exports: [],
    providers: [],
})
export class SigningsModule { }
