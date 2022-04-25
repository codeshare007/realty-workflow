import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedGeneralComboModule } from '@app/admin/signings/shared/shared-general-combo.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { UpdateContactModalComponent } from './create-edit-contact-modal/update-contact-modal.component';

@NgModule({
    imports: [
        CommonModule,
        ModalModule,
        AppBsModalModule,
        FormsModule,
        TabsModule,
        UtilsModule,
        SharedGeneralComboModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [
        UpdateContactModalComponent,
    ],
    exports: [
        UpdateContactModalComponent,
    ],
    providers: []
})
export class SharedModalsModule { }
