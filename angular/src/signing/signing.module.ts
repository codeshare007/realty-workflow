import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { SharedFormsLibraryModule } from '@app/shared/components/forms-library/shared-forms-library.module';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { CustomUrlSerializer } from '@shared/custom-url-serializer';
import { UtilsModule } from '@shared/utils/utils.module';
import { DetailsControlSigningComponent } from './components/details-control/details-control-signing.component';
import { SigningViewComponent } from './components/details-control/signing-view/signing-view.component';
import { KeyDownTabEnterDirective } from './directives/key-down-tab-enter.directive';
import { RejectModalComponent } from './modals/reject/reject-modal.component';
import { SigningRoutingModule } from './signing-routing.module';
import { SigningComponent } from './signing.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SigningRoutingModule,
        SharedFormsLibraryModule,
        AppBsModalModule,
        UtilsModule,
    ],
    declarations: [
        SigningComponent,
        SigningViewComponent,
        DetailsControlSigningComponent,
        RejectModalComponent,

        KeyDownTabEnterDirective,
    ],
    providers: [
        { provide: UrlSerializer, useClass: CustomUrlSerializer }
      ]
})
export class SigningModule { }
