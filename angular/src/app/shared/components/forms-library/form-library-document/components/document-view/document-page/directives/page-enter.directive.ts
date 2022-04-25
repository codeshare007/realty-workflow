import { Directive, ElementRef, HostListener, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[pageEnter]'
})
export class PageEnterDirective implements OnChanges {


    @Output() onPageMousemove: boolean;

    @HostListener('mousemove', ['$event'])
    mousemove(event) {

    }

    constructor(
        private el: ElementRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
    }
}
