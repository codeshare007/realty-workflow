import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SigningFormDesignComponent } from './signing-form-design/signing-form-design-page.component';
import { SigningPageComponent } from './signing-page/signing-page.component';
import { SigningsComponent } from './signings/signings.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SigningsComponent, data: { permission: 'Pages.Signings' } },
        { path: 'create', component: SigningPageComponent, data: { permission: 'Pages.Signings', isCreate: true } },
        { path: 'transaction/:transactionId/create', component: SigningPageComponent, data: { permission: 'Pages.Signings', isCreate: true } },
        { path: ':id', component: SigningPageComponent, data: { permission: 'Pages.Signings' } },
        { path: ':signingId/design', component: SigningFormDesignComponent, data: { permission: 'Pages.Signings' } }
    ])],
    exports: [RouterModule]
})
export class SigningsRoutingModule { }
