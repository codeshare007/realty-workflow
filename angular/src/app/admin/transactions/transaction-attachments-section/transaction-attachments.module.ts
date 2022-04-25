import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { FileUploadModule } from 'primeng';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CreateTransactionAttachmentModalComponent } from './modals/create-transaction-attachment-modal.component';
import { TransactionAttachmentsTableComponent } from './tables/transaction-attachments-table.component';
import { TransactionAttachmentsComponent } from './transaction-attachments.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppCommonModule,
        UtilsModule,
        TableModule,
        PaginatorModule,
        FileUploadModule,
        AppBsModalModule,
        UiComponentsModule,
    ],
    declarations: [
        CreateTransactionAttachmentModalComponent,
        TransactionAttachmentsTableComponent,
        TransactionAttachmentsComponent,
    ],
    exports: [
        TransactionAttachmentsComponent,
    ],
    providers: [],
})
export class TransactionAttachmentsModule { }
