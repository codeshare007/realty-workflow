import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ILeadСitiesList } from '../../../services/lead-general-info-cities.service';

@Component({
    selector: 'lead-general-info-cities-list',
    templateUrl: './lead-general-info-cities-list.component.html',
})
export class LeadGeneralInfoCitiesListComponent {
    @HostBinding('class.lead-general-info-cities-list') class = true;

    @Input() leadCities: ILeadСitiesList;

    selectCity(cityName: string, isChecked: boolean) {
        this.leadCities.cities.forEach(city => {
            if (city.name.startsWith(cityName)) {
                city.checked = isChecked;
            }
        });
    }
}
