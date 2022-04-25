import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SigningViewComponent } from './components/details-control/signing-view/signing-view.component';
import { SigningComponent } from './signing.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':code',
                component: SigningComponent,
            },
            {
                path: ':code/view',
                component: SigningViewComponent,
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SigningRoutingModule { }
