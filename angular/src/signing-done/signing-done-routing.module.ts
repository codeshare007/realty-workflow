import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SigningDoneComponent } from './signing-done.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SigningDoneComponent,
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SigningDoneRoutingModule { }
