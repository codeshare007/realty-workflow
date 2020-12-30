import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[dropDownClickOutside]'
})
export class ClickOutsideDirective {

    @Output() public dropDownClickOutside = new EventEmitter();

    private _elements = [];

    constructor(private _elementRef: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        if (this.isClassSearch(targetElement.className)) { return; }

        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);

        if (!isClickedInside) {
            this.dropDownClickOutside.emit(null);
        }
    }

    private isClassSearch(value: string): boolean {
        this._elements.push(value.includes('click-outside'));

        if (this._elements.length > 1) { return false; }
        return value.includes('click-outside');
    }
}
