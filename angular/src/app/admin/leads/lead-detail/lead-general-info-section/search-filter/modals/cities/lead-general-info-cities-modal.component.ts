import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ILeadСitiesList } from '../../services/lead-general-info-cities.service';

@Component({
    selector: 'lead-general-info-cities-modal',
    templateUrl: './lead-general-info-cities-modal.component.html'
})
export class LeadGeneralInfoCitiesModalComponent {

    @ViewChild('leadGeneralInfoCitiesModal') modal: ModalDirective;

    @Input() citiesList: ILeadСitiesList[] = [];

    @Output() modalSave: EventEmitter<ILeadСitiesList[]> = new EventEmitter<ILeadСitiesList[]>();

    active = false;

    public show(): void {
        this.active = true;
        this.modal.show();
    }

    public close(): void {
        this.active = false;
        this.modal.hide();
    }

    public save(): void {
        this.modalSave.emit(this.citiesList);
        this.close();
    }
}
