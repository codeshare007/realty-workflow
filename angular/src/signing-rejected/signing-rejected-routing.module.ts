import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SigningRejectedComponent } from './signing-rejected.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SigningRejectedComponent,
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SigningRejectedRoutingModule { }
