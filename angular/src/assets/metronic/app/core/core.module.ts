import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuDirective } from './_base/layout/directives/menu.directive';
import { OffcanvasDirective } from './_base/layout/directives/offcanvas.directive';
import { HeaderDirective } from './_base/layout/directives/header.directive';
import { ToggleDirective } from './_base/layout/directives/toggle.directive';
import { LayoutRefService } from './_base/layout/services/layout-ref.service';
import { ScrollTopDirective } from './_base/layout/directives/scroll-top.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        // directives
        MenuDirective,
        OffcanvasDirective,
        HeaderDirective,
        ToggleDirective,
        ScrollTopDirective
    ],
    exports: [
        // directives
        MenuDirective,
        OffcanvasDirective,
        HeaderDirective,
        ToggleDirective,
        ScrollTopDirective
    ],
    providers: [
        LayoutRefService
    ]
})
export class CoreModule { }
