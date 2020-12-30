import { Component } from '@angular/core';
import { ScrollTopOptions } from '@metronic/app/core/_base/layout/directives/scroll-top.directive';

@Component({
    selector: 'kt-scroll-top',
    templateUrl: './scroll-top.component.html',
})
export class ScrollTopComponent {
    // Public properties
    scrollTopOptions: ScrollTopOptions = {
        offset: 300,
        speed: 600
    };
}
