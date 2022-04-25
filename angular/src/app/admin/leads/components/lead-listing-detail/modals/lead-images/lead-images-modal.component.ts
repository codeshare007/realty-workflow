import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ListingVideoImage } from '../../models/lead-listing.model';

@Component({
    selector: 'lead-images-modal',
    templateUrl: './lead-images-modal.component.html'
})
export class LeadImagesModalComponent {

    @ViewChild('leadImagesModal', { static: true }) modal: ModalDirective;

    images: ListingVideoImage[] = [];

    public show(images: string[]): void {
        this._setImages(images);
        this.modal.show();
    }

    public close(): void {
        this.modal.hide();
    }

    public save() {
        this.close();
    }

    private _setImages(images: string[]): void {
        const filteredImages = images.filter((image) => {
            return image.includes('.jpg');
        });
        this.images = filteredImages.map((image, index) => {
            return new ListingVideoImage('image_' + index, image);
        });
    }
}
