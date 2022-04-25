import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SigningFormDesignPage } from '@app/admin/signings/signing-form-design/services/signing-form-design-page.service';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AngularResizeElementModule } from 'angular-resize-element';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ColorSketchModule } from 'ngx-color/sketch';
import { DndModule } from 'ngx-drag-drop';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { HideShowPassDirective } from './form-library-document/components/document-view/directives/hide-show-pass.directive';
import { KeyDownCtrlDirective } from './form-library-document/components/document-view/directives/key-down-ctrl.directive';
import { KeyDownCDirective } from './form-library-document/components/document-view/document-page/directives/key-down-c.directive';
import { KeyDownCmdDirective } from './form-library-document/components/document-view/document-page/directives/key-down-cmd.directive';
import { KeyDownDelDirective } from './form-library-document/components/document-view/document-page/directives/key-down-del.directive';
import { KeyDownVDirective } from './form-library-document/components/document-view/document-page/directives/key-down-v.directive';
import { PageEnterDirective } from './form-library-document/components/document-view/document-page/directives/page-enter.directive';
import { DocumentPageComponent } from './form-library-document/components/document-view/document-page/document-page.component';
import { DropdownActionComponent } from './form-library-document/components/document-view/document-page/page-control/components/actions/components/dropdown-action/dropdown-action.component';
import { ParticipantSettingActionComponent } from './form-library-document/components/document-view/document-page/page-control/components/actions/components/participant-setting-action/participant-setting-action.component';
import { TextPositionComponent } from './form-library-document/components/document-view/document-page/page-control/components/actions/components/text-position/text-position.component';
import { PageControlActionsComponent } from './form-library-document/components/document-view/document-page/page-control/components/actions/page-control-actions.component';
import { DateTimeControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/date-time-control/date-time-control.component';
import { DropdownControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/dropdown/dropdown-control.component';
import { InitialsControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/initials-control/initials-control.component';
import { MoqupControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/moqup-control/moqup-control.component';
import { PageControlService } from './form-library-document/components/document-view/document-page/page-control/components/services/page-control.service';
import { MatSignatureControlModalComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/modal/mat-modal/mat-signature-control-modal.component';
import { SignatureControlModalComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/modal/signature-control-modal.component';
import { UploadAttachmentModalComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/modal/upload-attachment/upload-attachment-modal.component';
import { SignatureControlService } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/services/signature-control.service';
import { SignatureControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/signature-control.component';
import { SignerNameControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/signer-name-control/signer-name-control.component';
import { SigningDateControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/signing-date-control/signing-date-control.component';
import { TextAreaControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/text-area-control/text-area-control.component';
import { TextFieldControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/text-field-control/text-field-control.component';
import { PageControlComponent } from './form-library-document/components/document-view/document-page/page-control/page-control.component';
import { ControlValueSigningPermissionPipe } from './form-library-document/components/document-view/document-page/pipes/constol-value-signing-permission.pipe';
import { ControlValueSigningTextPipe } from './form-library-document/components/document-view/document-page/pipes/constol-value-signing-text.pipe';
import { ControlValueTextPipe } from './form-library-document/components/document-view/document-page/pipes/constol-value-text.pipe';
import { ParticipantClassPipe } from './form-library-document/components/document-view/document-page/pipes/participant-class.pipe';
import { DocumentViewComponent } from './form-library-document/components/document-view/document-view.component';
import { DocumentViewService } from './form-library-document/components/document-view/services/document-view.service';
import { ControlDetailsComponent } from './form-library-document/components/form-controls/control-details/control-details.component';
import { FormLayerComponent } from './form-library-document/components/form-controls/form-layer/form-layer.component';
import { FormLibraryControlsComponent } from './form-library-document/components/form-controls/form-library-controls.component';
import { FormSwitchComponent } from './form-library-document/components/form-controls/form-switch/form-switch.component';
import { ViewModeToSelectPipe } from './form-library-document/components/form-controls/form-switch/pipes/view-mode-to-select.pipe';
import { InitialPageModalComponent } from './form-library-document/components/form-controls/modals/initial-pages/initial-page-modal.component';
import { ParticipantMargeItemComponent } from './form-library-document/components/form-controls/modals/participant-marge/participant-marge-item/participant-marge-item.component';
import { ParticipantMargeModalComponent } from './form-library-document/components/form-controls/modals/participant-marge/participant-marge-modal.component';
import { ParticipantSettingComponent } from './form-library-document/components/form-controls/participant-setting/participant-setting.component';
import { ParticipantComponent } from './form-library-document/components/form-controls/participant/participant.component';
import { ParticipantsFilterDefaultPipe } from './form-library-document/components/form-controls/pipes/participants-filter-default.pipe';
import { SwitchLayersOrderPipe } from './form-library-document/components/form-controls/pipes/switch-layers-order.pipe';
import { ControlDetailsService } from './form-library-document/components/form-controls/services/control-details.service';
import { ControlCopySettingService } from './form-library-document/components/form-controls/services/controls-copy-setting.service';
import { FormControlsService } from './form-library-document/components/form-controls/services/form-controls.service';
import { FormLibraryDocumentService } from './form-library-document/components/form-controls/services/form-library-document.service';
import { ParticipantSettingService } from './form-library-document/components/form-controls/services/participant-setting.service';
import { ResizableDraggableComponent } from './form-library-document/components/resizable-draggable/resizable-draggable.component';
import { FormsTableComponent } from './forms-library-table/forms-table.component';
import { SelectFormLibraryModalComponent } from './forms-library-table/select-form-library-modal/select-form-library-modal.component';
import { FilterModeSettingPipe } from './pipes/filter-mode-setting.pipe';
import { FormStatusToNamePipe } from './pipes/form-status-to-name.pipe';
import { LayerLabelPipe } from './pipes/layer-label.pipe';
import { MaskInitialsPipe } from './pipes/mask-initials.pipe';
import { PageLinePipe } from './pipes/page-line.pipe';
import { ControlCopyPasteService } from './services/control-copy-paste.service';
import { ControlDeleteService } from './services/control-delete.service';
import { DocumentControlHealperService } from './services/document-controller-helper.service';
import { FormStatusToNameService } from './services/form-status-to-name.service';
import { FormUrlService } from './services/http/form-url.service';
import { HttpService } from './services/http/http.service';
import { MultiSelectControlsService } from './services/multi-select-controls.service';
import { PageLinesService } from './services/page-lines.service';
import { ParticipantMargeService } from './services/participant-marge.service';
import { StickingLinesService } from './services/sticking-lines.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        PaginatorModule,
        AppCommonModule,
        UiComponentsModule,
        DndModule,
        DragDropModule,
        UtilsModule,
        AngularResizeElementModule,
        BsDatepickerModule,
        AppBsModalModule,
        ModalModule,
        TabsModule,
        AccordionModule,
        ColorSketchModule,
        FileUploadModule,
        MatDialogModule,
    ],
    declarations: [
        ResizableDraggableComponent,
        DocumentViewComponent,
        DocumentPageComponent,
        PageControlComponent,
        FormLibraryControlsComponent,
        FormLayerComponent,
        FormSwitchComponent,
        DateTimeControlComponent,
        SignatureControlModalComponent,
        SignatureControlComponent,
        TextFieldControlComponent,
        InitialsControlComponent,
        TextAreaControlComponent,
        FormsTableComponent,
        ParticipantComponent,
        ParticipantSettingComponent,
        SelectFormLibraryModalComponent,
        InitialPageModalComponent,
        ControlDetailsComponent,
        MoqupControlComponent,
        SigningDateControlComponent,
        PageControlActionsComponent,
        DropdownControlComponent,
        DropdownActionComponent,
        ParticipantSettingActionComponent,
        SignerNameControlComponent,
        ParticipantMargeModalComponent,
        ParticipantMargeItemComponent,
        UploadAttachmentModalComponent,
        TextPositionComponent,

        MatSignatureControlModalComponent,

        KeyDownCtrlDirective,
        HideShowPassDirective,
        PageEnterDirective,
        KeyDownVDirective,
        KeyDownCDirective,
        KeyDownDelDirective,
        KeyDownCmdDirective,

        FilterModeSettingPipe,
        LayerLabelPipe,
        MaskInitialsPipe,
        FormStatusToNamePipe,
        ParticipantClassPipe,
        ViewModeToSelectPipe,
        PageLinePipe,
        ControlValueTextPipe,
        ControlValueSigningTextPipe,
        ControlValueSigningPermissionPipe,
        SwitchLayersOrderPipe,
        ParticipantsFilterDefaultPipe,
    ],
    exports: [
        DocumentViewComponent,
        FormLibraryControlsComponent,
        FormsTableComponent,
        SelectFormLibraryModalComponent,

        KeyDownCtrlDirective,
        KeyDownCDirective,
        KeyDownVDirective,
        KeyDownDelDirective,
        KeyDownCmdDirective,

        PageLinePipe,
    ],
    providers: [
        FormLibraryDocumentService,
        DocumentViewService,
        SignatureControlService,
        FormStatusToNameService,
        FormControlsService,
        MultiSelectControlsService,
        SigningFormDesignPage,
        ControlCopySettingService,
        ControlDetailsService,
        PageControlService,
        PageLinesService,
        StickingLinesService,
        DocumentControlHealperService,
        ControlCopyPasteService,
        ControlDeleteService,
        ParticipantMargeService,
        HttpService,
        FormUrlService,
        ParticipantSettingService,
    ]
})
export class SharedFormsLibraryModule { }
