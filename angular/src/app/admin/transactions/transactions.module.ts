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
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { TransactionGeneralSectionComponent } from './manage-transaction/transaction-general-info-section/transaction-general-info-section.component';
import { GeneralComboStringComponent } from './shared/general-combo-string.component';
import { GeneralComboComponent } from './shared/general-combo.component';
import { SigningsTableComponent } from './signings-section/signings.component';
import { CreateEditContactModalComponent } from './transaction-contacts-section/create-edit-contact-modal/create-edit-contact-modal.component';
import { TransactionContactsComponent } from './transaction-contacts-section/transaction-contacts/transaction-contacts.component';
import { TransactionFormDesignComponent } from './transaction-form-design-page/transaction-form-design-page.component';
import { UploadDocumentModalComponent } from './transaction-forms-section/modals/upload-document-modal/upload-document-modal.component';
import { TransactionFormsTableComponent } from './transaction-forms-section/transaction-forms-table/transaction-forms-table.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        TableModule,
        PaginatorModule,
        TransactionsRoutingModule,
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
        TransactionsComponent,
        ManageTransactionComponent,
        TransactionGeneralSectionComponent,
        GeneralComboStringComponent,
        GeneralComboComponent,
        TransactionContactsComponent,
        CreateEditContactModalComponent,
        TransactionFormsTableComponent,
        UploadDocumentModalComponent,
        TransactionFormDesignComponent,
        SigningsTableComponent,
    ],
    exports: [],
    providers: [],
})
export class TransactionsModule { }
