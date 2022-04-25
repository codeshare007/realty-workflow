import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { UiToolTipComponent } from './ui-tool-tip/ui-tool-tip.component';


@Directive({
    selector: '[uiTooltip]'
})
export class UiToolTipDirective implements OnInit, OnDestroy {

    @Input('uiTooltip') text = '';

    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder,
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions([
                {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'bottom',
                    offsetY: -8,
                    offsetX: 10,
                }
            ]);

        this.overlayRef = this.overlay.create({ positionStrategy, panelClass: 'pos-absolute' });
    }

    ngOnDestroy(): void {
        this.hide();
    }

    @HostListener('mouseenter')
    show() {
        if (this.text.length) {
            const tooltipRef: ComponentRef<UiToolTipComponent> = this.overlayRef.attach(new ComponentPortal(UiToolTipComponent));
            tooltipRef.instance.text = this.text;
        }
    }

    @HostListener('mouseout')
    hide() {
        if (this.text.length) {
            this.overlayRef.detach();
        }
    }
}
