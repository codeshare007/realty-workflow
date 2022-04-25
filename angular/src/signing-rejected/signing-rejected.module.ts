import { NgModule } from '@angular/core';
import { SigningRejectedRoutingModule } from './signing-rejected-routing.module';
import { SigningRejectedComponent } from './signing-rejected.component';

@NgModule({
    imports: [
        SigningRejectedRoutingModule,
    ],
    declarations: [
        SigningRejectedComponent,
    ],
    providers: [
    ]
})
export class SigningRejectedModule { }
