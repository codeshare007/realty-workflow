import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[hideShowPass]'
})
export class HideShowPassDirective implements OnChanges {

    private _shown = true;
    private _isActive = true;

    @Input('hideShowPass') isShowAction: boolean;

    constructor(
        private el: ElementRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isShowAction && this.isShowAction) {
            this._setup();
        }
    }

    private _toggle(span: HTMLElement): void {
        this._shown = !this._shown;
        if (this._shown) {
            this.el.nativeElement.setAttribute('type', 'text');
            span.innerHTML = `<i class="fa fa-eye-slash fa-fw"></i>`;
        } else {
            this.el.nativeElement.setAttribute('type', 'password');
            span.innerHTML = `<i class="fa fa-eye fa-fw"></i>`;
        }
    }

    private _setup(): void {
        const parent = this.el.nativeElement.parentNode;
        const span = document.createElement('span');
        span.innerHTML = `<i class="fa fa-eye fa-fw"></i>`;
        span.className = 'hide-show-pass';
        span.addEventListener('click', () => {
            this._toggle(span);
        });
        parent.appendChild(span);
        if (this._isActive) {
            this._toggle(span);
            this._isActive = false;
        }
    }
}
