import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { SharedFormsLibraryModule } from '@app/shared/components/forms-library/shared-forms-library.module';
import { SharedModalsModule } from '@app/shared/components/modals/shared-modals.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DndModule } from 'ngx-drag-drop';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SharedGeneralComboModule } from '../signings/shared/shared-general-combo.module';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { TransactionGeneralSectionComponent } from './manage-transaction/transaction-general-info-section/transaction-general-info-section.component';
import { CreateEditPaymentModalComponent } from './manage-transaction/transaction-payment-tracker-section/create-edit-payment/create-edit-payment-modal.component';
import { OverviewTableComponent } from './manage-transaction/transaction-payment-tracker-section/overview-table/overview-table.component';
import { TransactionPaymentTrackerComponent } from './manage-transaction/transaction-payment-tracker-section/transaction-payment-tracker.component';
import { TransactionPaymentsComponent } from './manage-transaction/transaction-payment-tracker-section/transaction-payments/transaction-payments.component';
import { DuplicateTransactionModalComponent } from './modals/duplicate-transaction-modal/duplicate-transaction-modal.component';
import { SelectFormAnotherTransactionModalComponent } from './modals/select-form-another-transaction-modal/select-form-another-transaction-modal.component';
import { SigningStatusPipe } from './pipes/signing-status.pipe';
import { GeneralComboStringComponent } from './shared/general-combo-string.component';
import { SigningsTableComponent } from './signings-section/signings.component';
import { TransactionAttachmentsModule } from './transaction-attachments-section/transaction-attachments.module';
import { TransactionParticipantsComponent } from './transaction-contacts-section/transaction-participants/transaction-participants.component';
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
        BsDropdownModule.forRoot(),
        TransactionAttachmentsModule,
        SharedGeneralComboModule,
        SharedModalsModule,
    ],
    declarations: [
        TransactionsComponent,
        ManageTransactionComponent,
        TransactionGeneralSectionComponent,
        GeneralComboStringComponent,
        TransactionParticipantsComponent,
        TransactionFormsTableComponent,
        UploadDocumentModalComponent,
        TransactionFormDesignComponent,
        SigningsTableComponent,
        TransactionPaymentTrackerComponent,
        CreateEditPaymentModalComponent,
        TransactionPaymentsComponent,
        SelectFormAnotherTransactionModalComponent,
        DuplicateTransactionModalComponent,
        SigningStatusPipe,
        OverviewTableComponent,
    ],
    exports: [],
    providers: [],
})
export class TransactionsModule { }
