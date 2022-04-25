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
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DndModule } from 'ngx-drag-drop';
import { NgxMaskModule } from 'ngx-mask';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DuplicateSigningModalComponent } from './duplicate-signing-modal/duplicate-signing-modal.component';
import { IsOpenMargingModalPipe } from './pipes/is-open-marging-modal.pipe';
import { SigningStatusPipe } from './pipes/signing-status.pipe';
import { GeneralComboStringComponent } from './shared/general-combo-string.component';
import { SigningAttachmentsTableComponent } from './signing-attachments-section/signing-attachments-table.component';
import { EditParticipantEmailModalComponent } from './signing-contacts-section/edit-participant-email-modal/edit-participant-email-modal.component';
import { SelectTransactionParticipantModalComponent } from './signing-contacts-section/select-transaction-participant-modal/select-transaction-participant-modal.component';
import { SigningParticipantRequestComponent } from './signing-contacts-section/signing-participant-requests/signing-participant-requests.component';
import { SigningParticipantsComponent } from './signing-contacts-section/signing-participants/signing-participants.component';
import { SigningFormDesignComponent } from './signing-form-design/signing-form-design-page.component';
import { SubmitSigningModalComponent } from './signing-form-design/submit-signing-modal/submit-signing-modal.component';
import { SigningFormViewComponent } from './signing-form-view/signing-form-view-page.component';
import { SelectFormAnotherTransactionModalComponent } from './signing-forms-section/modals/select-form-another-transaction-modal/select-form-another-transaction-modal.component';
import { SelectFormTransactionModalComponent } from './signing-forms-section/modals/select-form-transaction-modal/select-form-transaction-modal.component';
import { UploadDocumentModalComponent } from './signing-forms-section/modals/upload-document-modal/upload-document-modal.component';
import { SigningFormsTableComponent } from './signing-forms-section/signing-forms-table/signing-forms-table.component';
import { SigningGeneralSectionComponent } from './signing-page/signing-general-info-section/signing-general-info-section.component';
import { SigningPageComponent } from './signing-page/signing-page.component';
import { ReminderFrequencyTypePipe } from './signing-settings-section/pipes/reminder-frequency-type.pipe';
import { ReminderFrequencyTypeToNameService } from './signing-settings-section/services/reminder-frequency-type-to-name.service';
import { SigningSettingsComponent } from './signing-settings-section/signing-settings.component';
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
        BsDropdownModule.forRoot(),
        InputSwitchModule,
        AccordionModule,
        BsDatepickerModule,
        SharedModalsModule,
        NgxMaskModule,
    ],
    providers: [
        ReminderFrequencyTypeToNameService,
    ],
    declarations: [
        SigningsComponent,
        SigningGeneralSectionComponent,
        GeneralComboStringComponent,
        SigningParticipantsComponent,
        SigningFormsTableComponent,
        UploadDocumentModalComponent,
        SigningFormDesignComponent,
        SigningPageComponent,
        SubmitSigningModalComponent,
        SigningSettingsComponent,
        SigningFormViewComponent,
        SigningParticipantRequestComponent,
        SelectTransactionParticipantModalComponent,
        SelectFormAnotherTransactionModalComponent,
        SelectFormTransactionModalComponent,
        DuplicateSigningModalComponent,
        SigningAttachmentsTableComponent,
        EditParticipantEmailModalComponent,

        SigningStatusPipe,
        ReminderFrequencyTypePipe,
        IsOpenMargingModalPipe,
    ],
    exports: [],
})
export class SigningsModule { }
