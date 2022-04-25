import { Injectable } from '@angular/core';
import { LeadGeneralInfoSearchDictionaryServices } from './lead-general-info-search-dictionary.service';

@Injectable()
export class LeadGeneralInfoCitiesService {
    private _citiesList: ILeadСitiesList[] = [];

    get citiesList(): ILeadСitiesList[] {
        return this._citiesList;
    }
    set citiesList(value: ILeadСitiesList[]) {
        this._citiesList = value;
    }

    constructor(
        private _leadDictionary: LeadGeneralInfoSearchDictionaryServices,
    ) { }

    public mapCitiesList(list: string[]): ILeadСitiesList[] {
        this.citiesList = this._leadDictionary.letters
            .map((letter: string) => {
                return new ILeadСitiesList(letter, this._mapCities(letter));
            });

        return this._mapLeadCities(list);
    }

    public setLeadCities(list: ILeadСitiesList[]): string[] {
        const solution = [];
        list.forEach((item) => {

            item.cities.forEach((city) => {
                if (city.checked && city.name !== 'System.String[]') {
                    solution.push(city.name);
                }
            });

        });

        return solution;
    }

    private _mapLeadCities(list: string[]): ILeadСitiesList[] {
        this.citiesList.map((item) => {

            item.cities.map((city) => {
                if (!city) { return; }

                if (list && list.includes(city.name) && city.name !== 'System.String[]') {
                    city.checked = true;
                }
            });

        });

        return this.citiesList;
    }

    private _mapCities(letter: string): ILeadСities[] {
        const solution = this._leadDictionary.citiesList['city_neighborhoods']
            .filter((city) => {
                return city.split('')[0].toUpperCase() === letter;
            }).map((city, index) => {
                return new ILeadСities(city, `id__${letter}__${index}`, false);
            });

        return solution;
    }
}

export class ILeadСitiesList {
    constructor(
        public letter: string,
        public cities: ILeadСities[],
    ) { }
}

export class ILeadСities {
    constructor(
        public name: string,
        public id: string,
        public checked: boolean,
    ) { }
}
