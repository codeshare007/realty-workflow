import { Directive } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Directive({
  selector: '[appBsModal]',
  exportAs: 'bs-modal'
})
export class AppBsModalDirective extends ModalDirective {
  showElement(): void {
    super.showElement();
    this.setZIndexes();
  }

  setZIndexes(): void {
    let newZIndex = this.setAndGetModalZIndex();
    this.setBackDropZIndex(newZIndex - 1);
  }

  setAndGetModalZIndex(): number {
    let modalBaseZIndex = 1050;
    let modalsLength = document.querySelectorAll('.modal.fade.show').length;

    let newZIndex = modalBaseZIndex + modalsLength * 2;

    (this as any)._element.nativeElement.style.zIndex = newZIndex.toString();
    return newZIndex;
  }

  setBackDropZIndex(zindex: number): void {
    let modalBackdrops = document.querySelectorAll('.modal-backdrop.fade.show');
    (modalBackdrops[modalBackdrops.length - 1] as HTMLElement).style.zIndex = zindex.toString();
  }
}
