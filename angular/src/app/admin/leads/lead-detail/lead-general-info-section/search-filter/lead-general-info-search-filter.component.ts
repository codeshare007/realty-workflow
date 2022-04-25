import { Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CheckListItem } from '@app/admin/shared/general-combo-string.component';
import { SelectItem } from '@app/shared/layout/components/ui-select/models/ui-select.model';
import { LeadEditDto } from '@shared/service-proxies/service-proxies';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LeadGeneralInfoCitiesModalComponent } from './modals/cities/lead-general-info-cities-modal.component';
import { ILeadСitiesList, LeadGeneralInfoCitiesService } from './services/lead-general-info-cities.service';
import { LeadGeneralInfoSearchDictionaryServices } from './services/lead-general-info-search-dictionary.service';

@Component({
    selector: 'lead-general-info-search-filter',
    templateUrl: './lead-general-info-search-filter.component.html',
    providers: [LeadGeneralInfoSearchDictionaryServices, LeadGeneralInfoCitiesService],
})
export class LeadGeneralInfoSearchFilterComponent implements OnInit, OnChanges, OnDestroy {

    @HostBinding('class.lead-general-info-search-filter') class = true;
    @ViewChild('leadGeneralInfoCitiesRef') citiesModal: LeadGeneralInfoCitiesModalComponent;
    @Input() lead: LeadEditDto = new LeadEditDto();
    @Input() disabled = false;
    @Output() search = new EventEmitter<boolean>();

    searchSubject = new Subject<boolean>();
    citiesStrings: string[] = [];
    petsFilters: CheckListItem[] = [
        new CheckListItem('cat', 'Cats Allowed', false),
        new CheckListItem('dog', 'Dogs Allowed', false),
    ];
    citiesList: ILeadСitiesList[] = [];

    constructor(
        public leadGeneral: LeadGeneralInfoSearchDictionaryServices,
        private _leadGeneralInfoCitiesService: LeadGeneralInfoCitiesService,
    ) { }

    ngOnInit(): void {
        this.citiesList = this._leadGeneralInfoCitiesService.mapCitiesList(this.lead.cities);

        this.searchSubject.pipe(
            debounceTime(500)
        ).subscribe(() => {
            this.search.emit(true);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.petsFilters = this.petsFilters.map((f) => {
            f.checked = this.lead.pets && this.lead.pets.length && this.lead.pets.indexOf(f.value) !== -1;

            return f;
        });
    }

    ngOnDestroy(): void {
        this.searchSubject.complete();
    }

    updatePats() {
        this.lead.pets = this.petsFilters.filter(p => p.checked).map(p => p.value);
        this.searchSubject.next(true);
    }

    public onSelectedBathrooms(event: SelectItem[]): void {
        if (event && event.length && event[0].id === 'id-select-item__0') {
            this.lead.bathrooms = undefined;
        } else {
            this.lead.bathrooms = event.map((item: SelectItem) => {
                return item.data.type;
            });
        }
        this.searchSubject.next(true);
    }

    public onSetCities(event: ILeadСitiesList[]): void {
        this.lead.cities = this._leadGeneralInfoCitiesService.setLeadCities(event);
        this.searchSubject.next(true);
    }

    public showCitiesModal(): void {
        this.citiesModal.show();
    }

    public onSelectedBedrooms(event: SelectItem[]): void {
        if (event && event.length && event[0].id === 'id-select-item__0') {
            this.lead.bedrooms = undefined;
        } else {
            this.lead.bedrooms = event.map((item: SelectItem) => {
                return item.data.type;
            });
        }
        this.searchSubject.next(true);
    }
}
