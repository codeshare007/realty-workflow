import { NgModule } from '@angular/core';
import { AppBsModalDirective } from './app-bs-modal.directive';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [AppBsModalDirective],
    imports: [CommonModule],
    exports: [AppBsModalDirective]
})
export class AppBsModalModule {}
