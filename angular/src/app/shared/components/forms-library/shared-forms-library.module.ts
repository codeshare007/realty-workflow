import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UiComponentsModule } from '@app/shared/layout/components/ui-components.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AngularResizeElementModule } from 'angular-resize-element';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DndModule } from 'ngx-drag-drop';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DocumentPageComponent } from './form-library-document/components/document-view/document-page/document-page.component';
import { DateTimeControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/date-time-control/date-time-control.component';
import { InitialsControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/initials-control/initials-control.component';
import { SignatureControlModalComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/modal/signature-control-modal.component';
import { SignatureControlService } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/services/signature-control.service';
import { SignatureControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/signature-control/signature-control.component';
import { TextAreaControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/text-area-control/text-area-control.component';
import { TextFieldControlComponent } from './form-library-document/components/document-view/document-page/page-control/components/text-field-control/text-field-control.component';
import { PageControlComponent } from './form-library-document/components/document-view/document-page/page-control/page-control.component';
import { DocumentViewComponent } from './form-library-document/components/document-view/document-view.component';
import { DocumentViewService } from './form-library-document/components/document-view/services/document-view.service';
import { FormLayerComponent } from './form-library-document/components/form-controls/form-layer/form-layer.component';
import { FormLibraryControlsComponent } from './form-library-document/components/form-controls/form-library-controls.component';
import { FormSwitchComponent } from './form-library-document/components/form-controls/form-switch/form-switch.component';
import { FormLibraryDocumentService } from './form-library-document/components/form-controls/services/form-library-document.service';
import { ResizableDraggableComponent } from './form-library-document/components/resizable-draggable/resizable-draggable.component';
import { FormsLibraryTableComponent } from './forms-library-table/forms-library-table.component';
import { FormsTableComponent } from './forms-library-table/forms-table.component';
import { FilterModeSettingPipe } from './pipes/filter-mode-setting.pipe';
import { FormStatusToNamePipe } from './pipes/form-status-to-name.pipe';
import { LayerLabelPipe } from './pipes/layer-label.pipe';
import { DragDropHealperService } from './services/drag-drop-healper.service';
import { FormStatusToNameService } from './services/form-status-to-name.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
    ],
    declarations: [
        FormsLibraryTableComponent,
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

        FilterModeSettingPipe,
        LayerLabelPipe,
        FormsTableComponent,
        FormStatusToNamePipe,
    ],
    exports: [
        FormsLibraryTableComponent,
        DocumentViewComponent,
        FormLibraryControlsComponent,
        FormsTableComponent,
    ],
    providers: [
        FormLibraryDocumentService,
        DragDropHealperService,
        DocumentViewService,
        SignatureControlService,
        FormStatusToNameService
    ]
})
export class SharedFormsLibraryModule { }
